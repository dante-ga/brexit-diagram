import { Title, Func, Factors, Grouping } from './components/factors.js'
import { Radio, Checkbox, Slider, Select, ThreePointEstimates } from './components/inputs.js'
import { data, updateData, factorTitles, valueData} from './data.js'
import { updateView } from './app.js'
import { round2tenth } from './util.js'

function setBrexitApproval(value) {
  updateData({brexitApproval: value})
  updateView()
}


const brexitOptions = {
  remain: 'Remain',
  deal: 'Deal',
  noDeal: 'No-deal',
}

const customFactors = {}

customFactors.brexitApproval = () => [
  Title('UK Brexit decision', brexitOptions[data.brexitApproval]),
  Func('UK picks the following Brexit option:'),
  Radio('brexitApproval', brexitOptions, data.brexitApproval, setBrexitApproval),
]

customFactors.ukInEu = () => [
  Title("UK's membership in the EU", data.ukInEu),
  Func("Unless it remains in the EU, the UK will be effectively outside the EU immediately after no-deal Brexit or after the two year transition period as per the Brexit deal."),
]

function setScotlandApproval(value) {
  updateData({scotlandApproval: value})
  updateView()
}

customFactors.scotlandApproval = () => [
  Title("Scottish independence intention", data.scotlandApproval),
  Func(),
  Checkbox('scotlandApproval', data.scotlandApproval, setScotlandApproval),
]

function setIndScotProb(value) {
  updateData({indScotProb: value})
  updateView()
}

customFactors.independentScotland = () => [
  Title("Scottish independence", data.independentScotland),
  Func(`If Scotland decides to become independent then with probability P it will become independent.`),
  Slider({
    value: data.indScotProb,
    onChange: setIndScotProb,
  }),
]

function setScotEuMemberProb(value) {
  updateData({scotEuMemberProb: value})
  updateView()
}

customFactors.scotlandEuMember = () => [
  Title("Scotland is a member of the EU", data.scotlandEuMember),
  Func(`If Scotland will become independent then with probability P it will join the EU.`),
  Slider({
    value: data.scotEuMemberProb,
    onChange: setScotEuMemberProb,
  }),
]

customFactors.scotlandInEu = () => [
  Title(factorTitles.scotlandInEu, data.scotlandInEu),
  Func("Scotland will be in the EU if it will become an EU member or if Scotland will remain in the UK which will remain in the EU."),
]

function setIrishBorder(value) {
  updateData({irishBorder: value})
  updateView()
}

const irishBorderOptions = {
  hardBorder: 'Hard border',
  brokenBorder: 'EU-UK border broken in Ireland',
  seaBorder: 'Irish Sea border',
  unitedIreland: 'United Irland in the EU',
  openBorder: 'Open Irish border in the EU'
}

const camel2space = str => str.replace( /([A-Z])/g, " $1" ).toLowerCase()

customFactors.irishBorder = () => {
  let disabled
  if (data.ukInEu) {
    disabled = ['hardBorder', 'brokenBorder', 'seaBorder', 'unitedIreland']
  } else {
    disabled = ['openBorder']
  }
  return [
    Title(factorTitles.irishBorder, camel2space(data.irishBorder)),
    Func('If UK leaves the EU, Irish border arrangements will need to be negotiated.'),
    Radio('irishBorder', irishBorderOptions, data.irishBorder, setIrishBorder, disabled),
  ]
}

function setViolenceNi(value) {
  updateData({violenceNi: value})
  updateView()
}

const violenceEstimates = []
for (const option in irishBorderOptions) {
  violenceEstimates.push({
    option,
    label: irishBorderOptions[option],
    optimistic: 0.25,
    mostLikely: 0.5,
    pessimistic: 0.75,
  })
}

customFactors.violenceNi = () => [
  Title("Violence in Northern Ireland", data.violenceNi * 100, true),
  Func(`Violence in Northern Ireland is represented on the scale from the most peaceful region in the world (0) to the most violent (100). Please make an optimisic (O), pessimistic (P) and most likely (ML) estimates of violence under each of the following border arrangements.`),
  ThreePointEstimates(violenceEstimates),
]

customFactors.breokenDeal = () => [
  Title(factorTitles.breokenDeal, data.breokenDeal),
  Func("Brexit deal bans hard border in Ireland."),
]


const factors = []
let starredIds = new Set()
if (localStorage.getItem('starredIds')) {
  starredIds = new Set(JSON.parse(localStorage.getItem('starredIds')))
}

for (const factorName in customFactors) {
  const factor = customFactors[factorName]
  factor.id = factorName + ':custom'
  factors.push(factor)
}

for (const agent in valueData) {
  const factorVals = valueData[agent]
  for (const factorKey in factorVals) {
    const factor = () => {
      const title = `${factorTitles[factorKey]} [${agent}\xa0value]`
      const valObj = factorVals[factorKey]
      let value = valObj.value
      if (!valObj.positive) {
        value = -value
      }
      value = round2tenth(value)
      return [
        Title(title, value)
      ]
    }
    factor.id = factorKey + ':' + agent + ':value'
    factors.push(factor)
  }
}

for (const agent in data.agentValueTotals) {
  const factor = () => {
    const total = data.agentValueTotals[agent]
    const title = `Total ${agent} value`
    return [
      Title(title, total)
    ]
  }
  factor.id = agent + ':totalValue'
  factors.push(factor)
}

const toggleStar = (id, starred) => () => {
  (starred) ? starredIds.delete(id) : starredIds.add(id)
  updateView()
  localStorage.setItem('starredIds', JSON.stringify([...starredIds]))
}

const tagFactors = [
  {label: 'Scotland', ids: new Set(["independentScotland:Scotland:value","scotlandInEu:Scotland:value","scotlandApproval:custom","independentScotland:custom","scotlandEuMember:custom","Scotland:totalValue","scotlandInEu:custom","brexitApproval:custom"])},
]

let factorTags = {}
for (const {id} of factors ) {
  factorTags[id] = []
}
for (const {label , ids} of tagFactors) {
  ids.forEach((id) => {
    factorTags[id].push(label)
  })
}

let activeTag = 'starred'
const tagLabels = ['all', 'starred', ...tagFactors.map(({label}) => label)]

const setTag = (tag) => {
  activeTag = tag
  updateView()
}

export const getFactors = () => {
  const showAll = activeTag === 'all'
  const showStarred = activeTag === 'starred'
  let showIds
  if (showStarred) {
    showIds = starredIds
  } else if (showAll) {
    showIds = null
  } else {
    showIds = tagFactors.find(({label}) => label === activeTag).ids
  }
  const factorColumns = Factors(factors
    .filter(factor => showAll || showIds.has(factor.id))
    .map(factor => {
      const content = factor()
      const { id } = factor
      let star = ''
      if (showAll) {
        const starred = starredIds.has(id)
        const tags = factorTags[id]
        star = Grouping(tags, starred, toggleStar(id, starred))
      }
      return {content, star}
    })
  )
  const tagOptions = tagLabels.map(tag => ({
    label: tag,
    value: tag,
    selected: tag === activeTag,
  }))
  const filter = Select('Tag', tagOptions, setTag)
  return [
    filter,
    factorColumns,
  ]
}
