import './mock_dom.js'
import { domain, getMainDecision } from '../client/js/domain/domain.js'
import AWS from 'aws-sdk'
import fs from 'fs'
import { importUserVals, userVals } from '../client/js/calc/calc.js'
import { importUserValues } from '../client/js/routes/values.js'
import { types } from '../client/js/types.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const valPref = 'val_'
const valuePref = 'value_'

const attributes = []
const attrGroups = {}
const attrSubs = {}
for (const key in domain) {
  const { choice, decidedBy, valuedBy, type, options, mergeInto, subKey } = domain[key]
  if (choice && !decidedBy) {
    const attr = valPref + key
    attributes.push(attr)
    const groupKey = (mergeInto) ? valPref + mergeInto : attr
    if (!attrGroups.hasOwnProperty(groupKey)) {
      attrGroups[groupKey] = []
    }
    attrGroups[groupKey].push(attr)
    if (!attrSubs.hasOwnProperty(subKey)) {
      attrSubs[subKey] = []
    }
    attrSubs[subKey].push(attr)
  }
  if (valuedBy) {
    const groupKey = valuePref + key
    attrGroups[groupKey] = []
    attrSubs[subKey] = []
    for (const agent of valuedBy) {
      if (type === 'option') {
        for (const option in options) {
          const attr = valuePref + agent + '_' + key + '_' + option
          attributes.push(attr)
          attrGroups[groupKey].push(attr)
          attrSubs[subKey].push(attr)
        }
      } else {
        const attr = valuePref + agent + '_' + key
        attributes.push(attr)
        attrGroups[groupKey].push(attr)
        attrSubs[subKey].push(attr)
      }
    }
  }
}

AWS.config.update({region: 'eu-west-1'})
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

const decide = (data) => {
  importUserVals(data)
  importUserValues(data)
  return getMainDecision(userVals)
}

const main = async () => {
  const dbResponse = await ddb.scan({
    TableName: 'Users',
    ProjectionExpression: attributes.join(','),
    FilterExpression: 'attribute_exists (complete)'
  }).promise()

  //Sort users into options they support
  const users = dbResponse.Items.map(AWS.DynamoDB.Converter.unmarshall)
  const optionUsers = {}
  for (const user of users) {
    const decision = decide(user)
    const { bestOption } = decision
    if (!optionUsers.hasOwnProperty(bestOption)) {
      optionUsers[bestOption] = []
    }
    optionUsers[bestOption].push(user)
  }

  //Calculate average user per option
  const optionAvgs = {}
  const optionAvgDecisions = {}
  for (const option in optionUsers) {
    const faction = optionUsers[option]
    const totals = {}
    attributes.forEach(attr => totals[attr] = 0)
    for (const member of faction) {
      attributes.forEach(attr => totals[attr] += member[attr])
    }
    const avgs = {}
    attributes.forEach(attr => avgs[attr] = totals[attr] / faction.length)
    optionAvgs[option] = avgs

    optionAvgDecisions[option] = decide(avgs)
  }

  function getGapChanges(sections) {
    const gapChanges = {}
    for (const sectionKey in sections) {
      gapChanges[sectionKey] = 0
      for (const option in optionAvgs) {
        const deviant = { ...optionAvgs[option] }
        for (const alt in optionAvgs) {
          if (alt === option) continue
          for (const deviantAttr of sections[sectionKey]) {
            deviant[deviantAttr] = optionAvgs[alt][deviantAttr]
          }
          //TODO: Performance: do not re-calculate parts of the decision which are not affected by the deviant attributes.
          const decision = decide(deviant)
          const deviantGap = decision.alternatives[option].totalValue - decision.alternatives[alt].totalValue
          const origAlternatives = optionAvgDecisions[option].alternatives
          const originalGap = origAlternatives[option].totalValue - origAlternatives[alt].totalValue
          const gapChange = deviantGap - originalGap
          gapChanges[sectionKey] += Math.abs(gapChange)
        }
      }
      gapChanges[sectionKey] = Math.round(gapChanges[sectionKey])
    }
    return gapChanges
  }
  const nodeImportances = getGapChanges(attrGroups)
  const subImportances = getGapChanges(attrSubs)

  //Create histograms for each of the attributes
  const num_bins = 50
  const histograms = {}
  attributes.forEach(attr => histograms[attr] = {})
  for (const option in optionUsers) {
    attributes.forEach(attr => histograms[attr][option] = Array(num_bins).fill(0))
    for (const user of optionUsers[option]) {
      for (const attr in user) {
        let type
        if (attr.startsWith(valPref)) {
          const key = attr.slice(valPref.length)
          type = domain[key].type
        } else if (attr.startsWith(valuePref)) {
          type = 'value'
        } else {
          continue
        }
        const { min, max } = types[type]
        const binIndex = Math.floor((num_bins * (user[attr] - min)) / (max - min))
        histograms[attr][option][binIndex]++
      }
    }
  }

  const stats = {nodeImportances, subImportances, histograms}
  fs.writeFile(
    __dirname + '/../client/stats.json',
    JSON.stringify(stats),
    'utf8',
    (err) => {
      if (err) {
        console.log({err})
      }
    }
  )
}
main()
