import { updateView } from './app.js'

export const data = {
  brexitApproval: 'remain',
  scotlandApproval: false,
  indScotProb: 0.5,
  scotEuMemberProb: 0.5,
  violenceNi: 0.5,
}

export let activeAgent = 'UK'

export const setAgent = (agent) => {
  activeAgent = agent
  updateView()
}

export const factorTitles = {
  independentScotland: 'Scottish independence',
  gibraltarInUk: 'Gibraltar is part of the UK',
  euForcedLaws: 'Laws forced by the EU',
  scotlandInEu: 'Scotland is in the EU',
  irishBorder: 'Irish borders',
  breokenDeal: 'Irish border Brexit deal is broken',
}

const agentValues = {
  UK: {
    independentScotland: -76,
    gibraltarInUk: 65,
    euForcedLaws: -46,
  },
  Scotland: {
    independentScotland: -10,
    scotlandInEu: 15
  }
}

export const valueData = {}
for (const agent in agentValues) {
  const factors = {}
  for (const factor in agentValues[agent]) {
    const val = agentValues[agent][factor]
    factors[factor] = {
      positive: val >= 0,
      value: Math.abs(val)
    }
  }
  valueData[agent] = factors
}

export const getAgentValueTotals = () => {
  const totalValues = {}
  for (const agent in valueData) {
    let total = 0
    for (const factor in valueData[agent]) {
      const {positive, value} = valueData[agent][factor]
      if (data[factor] === true) {
        if (positive) {
          total += value
        } else {
          total -= value
        }
      }
    }
    totalValues[agent] = total
  }
  return totalValues
}

export const agents = Object.keys(agentValues)

const toggleSign = (valObj) => () => {
  valObj.positive = !valObj.positive
  updateData()
  updateView()
}

const onValueChange = (valObj) => (newValue) => {
  if (newValue < 0) {
    valObj.value = -newValue
    valObj.positive = !valObj.positive
  } else {
    valObj.value = newValue
  }
  updateData()
  updateView()
}

const onGapChange = (thisIndex, order, oldGap, factors) => (newGap) => {
  if (newGap < 0) newGap = 0
  const diff = newGap - oldGap
  if (!isNaN(diff)) {
    for (let i = thisIndex; i < order.length; i++) {
      factors[order[i].factor].value += diff
    }
  }
  updateData()
  updateView()
}

export function getValueList() {
  let prevValue = 0
  const factors = valueData[activeAgent]
  const valueList = Object.keys(factors)
    .map(factor => ({
      factor,
      value: factors[factor].value,
    }))
    .sort((a, b) => a.value - b.value)
    .map(({factor, value}, index, order) => {
      const gap = value - prevValue
      prevValue = value
      const valObj = factors[factor]
      const valueItem = {
        factor,
        gap,
        title: factorTitles[factor],
        ...valObj,
        refObj: valObj
      }
      //Tie callbacks to the context
      valueItem.toggleSign = toggleSign(valObj)
      valueItem.onValueChange = onValueChange(valObj)
      valueItem.onGapChange = onGapChange(index, order, gap, factors)
      return valueItem
    })
  return valueList
}

export function rescaleValues() {
  const factors = valueData[activeAgent]
  const maxValue = Math.max(...Object.keys(factors).map(
    factor => factors[factor].value
  ))
  if (maxValue !== 0) {
    const scale = 100 / maxValue
    Object.keys(factors).forEach(
      factor => factors[factor].value *= scale
    )
    updateData()
    updateView()
  }
}

export function updateData(newData = {}) {
  Object.assign(data, newData)
  data.octoberBrexit = data.brexitApproval === 'noDeal'
  data.mayDeal = data.brexitApproval === 'deal'
  data.ukInEu = !(data.octoberBrexit || data.mayDeal)
  data.independentScotland = data.scotlandApproval && (Math.random() < data.indScotProb)
  data.scotlandEuMember = data.independentScotland && (Math.random() < data.scotEuMemberProb)
  data.scotlandInEu = data.scotlandEuMember || (data.ukInEu && !data.independentScotland)
  if (data.ukInEu) data.irishBorder = 'openBorder'
  if (!data.ukInEu && data.irishBorder === 'openBorder') data.irishBorder = 'brokenBorder'
  data.breokenDeal = data.mayDeal && (data.irishBorder === 'hardBorder')

  data.agentValueTotals = getAgentValueTotals()
}

updateData()
