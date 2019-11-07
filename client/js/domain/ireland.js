import { getNegotiationDistribution } from '../calc/negotiation.js'
import { getAgentValue } from '../calc/value.js'
import { clone } from '../util.js'
import { outLink } from '../components/global.js'

const factors = {}

factors.irishBorder = {
  type: 'option',
  title: 'Irish borders negotiation',
  desc: `
    The United Kingdom, Northern Ireland and the European Union negotiate which Irish borders arrangement to put in place.
    <ul>
      <li><strong>Hard border</strong> - set up border infrastructure between Northern Ireland and the Republic of Ireland</li>
      <li><strong>EU-UK border breach</strong> - breach in the EU-UK border on the island of Ireland</li>
      <li><strong>Irish Sea border</strong> - a border between Northern Ireland following some EU regulations and the rest of the UK</li>
      <li><strong>United Ireland</strong> - Northern Ireland leaves the UK, joins the republic and becomes a part of the EU</li>
      <li><strong>Open border</strong> - the functioning open border remains (subject to UK remaining in the EU)</li>
    </ul>
  `,
  calcDesc: `If the UK will maintain its <a href="/factor/ukInEu">EU membership</a> the "open border" in Ireland will continue to function. Otherwise, if the current Brexit deal will be legislated an Irish Sea border will be created (${outLink('Brexit deal: the Northern Ireland protocol', 'https://www.instituteforgovernment.org.uk/explainers/brexit-deal-northern-ireland-protocol')}). Otherwise, in a no-deal Brexit scenario, all options except the "open border" will be considered. Each of them is evaluated and ranked by each of the agents (UK, NI, EU) separately. A negotiation algorithm determines probabilities of each of the outcomes according to the rankings. These probabilities are then used when calculating total expected value of this negotiation.`,
  options: {
    hardBorder: 'Hard border',
    brokenBorder: 'EU-UK border breach',
    seaBorder: 'Irish Sea border',
    unitedIreland: 'United Ireland',
    openBorder: 'Open border',
  },
  calc: c => {
    if (c.brexitApproval === 'remain') {
      return 'openBorder'
    } else if (c.brexitApproval === 'deal') {
      return 'seaBorder'
    } else {
      if (c.irishBorder === 'openBorder') {
        return 'brokenBorder'
      } else {
        return c.irishBorder
      }
    }
  },
  valuedBy: ['UK', 'NI', 'EU'],
  decidedBy: ['UK', 'NI', 'EU'],
}

const violenceNiArguments = {
  hardBorder: false,
  brokenBorder: false,
  seaBorder: false,
  unitedIreland: false,
  openBorder: false,
}

const optionEntries = Object.entries(factors.irishBorder.options)
for (let i = 0; i < optionEntries.length; i++ ) {
  const [option, label] = optionEntries[i]
  const key = 'violenceNi_' + option
  factors[key] = {
    type: 'unitInterval',
    sliderLabel: label,
    mergeInto: 'violenceNi',
    choice: true,
    arguments: violenceNiArguments[option]
  }
  if (i === optionEntries.length - 1) {
    factors[key].minLabel = 'No violence'
    factors[key].maxLabel = 'War'
  }
}

factors.violenceNi = {
  type: 'unitInterval',
  title: 'Violence in Northern Ireland',
  question: "What are expected levels of violence in Northern Ireland under each of the following border arrangements?",
  desc: `Scale: <strong>0%</strong> = no violence; <strong>100%</strong> = war.`,
  calc: c => c['violenceNi_' + c.irishBorder],
  valuedBy: ['UK', 'NI', 'EU'],
}

factors.brokenDeal = {
  type: 'boolean',
  title: "Breach of 'no hard border' agreement",
  desc: 'As part of the current Brexit deal both parties agree to prevent creation of a hard border between the Republic of Ireland and Northern Ireland.',
  calcDesc: `The breach will occur if the <a href="/factor/brexitApproval">Brexit deal</a> is legislated but the <a href="/factor/irishBorder">hard border</a> is established despite of that.`,
  calc: c => (c.brexitApproval === 'deal') && (c.irishBorder === 'hardBorder'),
  valuedBy: ['UK', 'NI', 'EU'],
}

const diagram = `
  brexitApproval irishBorder    $irishBorder
  -              -              violenceNi   $violenceNi
  -              -              brokenDeal   $brokenDeal
`

//Note: due to complexity of generalization expected values are calculated explicitly without reuse of 'calc' functions.
const agents = factors.irishBorder.decidedBy
const options = Object.keys(factors.irishBorder.options).filter(opt => opt !== 'openBorder')

const getValue = (vals) => {
  const { ukInEu, brexitApproval } = vals
  let subValue = 0
  let subNodeValues = {}
  if (brexitApproval === 'noDeal') {
    const { agentValues, negotiationValues } = getBorderValues(vals)
    const borderDist = getNegotiationDistribution(options, negotiationValues)
    for (const option of options) {
      for (const key in agentValues['UK'][option]) {
        const value = agentValues['UK'][option][key] * borderDist[option]
        subNodeValues[key] = (subNodeValues[key] || 0) + value
        subValue += value
      }
    }
  } else {
    const option = (brexitApproval === 'remain') ? 'openBorder' : 'seaBorder'
    subNodeValues = {
      brokenDeal: 0,
      violenceNi: getAgentValue('violenceNi', vals['violenceNi_' + option], 'UK'),
      irishBorder: getAgentValue('irishBorder', option, 'UK'),
    }
    subValue = subNodeValues.violenceNi + subNodeValues.irishBorder
  }
  return { subValue, subNodeValues }
}

const getBorderValues = (vals) => {
  const { brexitApproval } = vals
  let agentValues = {}
  let negotiationValues = { }
  for (const agent of agents) {
    agentValues[agent] = {}
    negotiationValues[agent] = {}
    for (const option of options) {
      const brokenDeal = (brexitApproval === 'deal') && (option === 'hardBorder')
      agentValues[agent][option] = {
        brokenDeal: getAgentValue('brokenDeal', brokenDeal, agent),
        violenceNi: getAgentValue('violenceNi', vals['violenceNi_' + option], agent),
        irishBorder: getAgentValue('irishBorder', option, agent),
      }
      negotiationValues[agent][option] = Object.values(agentValues[agent][option])
        .reduce((a, b) => a + b, 0)
    }
  }
  return { agentValues, negotiationValues }
}

export const ireland = { factors, diagram, getValue }
