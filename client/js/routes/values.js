import { ValuesTable } from '../components/values.js'
import { Button, Tabs } from '../components/global.js'
import { setUserValues } from '../calc/value.js'
import { domain } from '../domain/domain.js'
import { updateView, navigate } from '../app.js'
import { types } from '../types.js'
import { persist, bulkPersist } from '../persist.js'
import { round2tenth } from '../util.js'

//TODO: Separate user values into a simple map from the complex list of value objects with "positive" parameter.
const getInitUserValues = () => {
  const userValues = {}
  for (const factor in domain) {
    const { valuedBy, type } = domain[factor]
    if (valuedBy) {
      for (const agent of valuedBy) {
        if (!userValues[agent]) userValues[agent] = {}
        Object.assign(
          userValues[agent],
          types[type].getValueObjs(domain[factor])
        )
      }
    }
  }
  for (const agent in userValues) {
    for (const key in userValues[agent]) {
      Object.assign(userValues[agent][key], {
        positive: true,
        value: 0,
        key,
        agent,
      })
    }
  }
  return userValues
}

const userValues = getInitUserValues()
setUserValues(userValues)
const agents = Object.keys(userValues)
export let activeAgent = agents[0]

const persistPrefix = 'value_'

export const importUserValues = (data) => {
  for (const dataKey in data) {
    if (dataKey.startsWith(persistPrefix)) {
      const [_, agent, ...keyParts] = dataKey.split('_')
      const key = keyParts.join('_')
      try {
        const valObj = userValues[agent][key]
        const realValue = data[dataKey]
        valObj.positive = realValue >= 0
        valObj.value = Math.abs(realValue)
        valObj.touched = true
      } catch (e) {
        console.warn(`Can't import user value "${dataKey}".`)
      }
    }
  }
}

const getPersistKey = valObj => persistPrefix + valObj.agent + '_' + valObj.key
const getRealValue = valObj => valObj.value * ((valObj.positive) ? 1 : -1)
const persistValObj = valObj => persist(getPersistKey(valObj), getRealValue(valObj))

const persistMultiple = (affected) => {
  const data = {}
  affected.forEach(valObj => data[getPersistKey(valObj)] = getRealValue(valObj))
  bulkPersist(data)
}

const toggleSign = (valObj) => () => {
  valObj.positive = !valObj.positive
  updateView()
  persistValObj(valObj)
}

//TODO: Debug negative sign not disapearing in the number input
export const onValueChange = (valObj, absolute=true) => (newValue) => {
  if (newValue < 0) {
    valObj.value = -newValue
    valObj.positive = absolute && !valObj.positive
  } else {
    valObj.value = newValue
    if (!absolute) {
      valObj.positive = true
    }
  }
  valObj.touched = true
  updateView()
  persistValObj(valObj)
}

const onGapChange = (thisIndex, order, oldGap, factors) => (newGap) => {
  if (newGap < 0) newGap = 0
  const diff = newGap - oldGap
  if (!isNaN(diff)) {
    const affected = []
    for (let i = thisIndex; i < order.length; i++) {
      const valueObj = factors[order[i].factor]
      valueObj.value += diff
      valueObj.touched = true
      affected.push(valueObj)
    }
    persistMultiple(affected)
  }
  updateView()
}

const rescaleValues = () => {
  const factors = userValues[activeAgent]
  const maxValue = Math.max(...Object.keys(factors).map(
    factor => factors[factor].value
  ))
  if (maxValue !== 0 && maxValue !== 100) {
    const scale = 100 / maxValue
    const affected = []
    Object.keys(factors).forEach(
      factor => {
        const valueObj = factors[factor]
        if (valueObj.value !== 0) {
          valueObj.value = round2tenth(valueObj.value * scale)
          affected.push(valueObj)
        }
      }
    )
    updateView()
    persistMultiple(affected)
  }
}

export const getValueList = (agent, editable=true) => {
  let prevValue = 0
  const factors = userValues[agent]
  const valueList = Object.keys(factors)
    .map(factor => ({
      factor,
      value: factors[factor].value,
    }))
    .sort((a, b) => a.value - b.value)
    .map(({factor, value}, index, order) => {
      const valObj = factors[factor]
      if (editable) {
        const gap = value - prevValue
        prevValue = value
        const valueItem = { factor, gap, refObj: valObj, ...valObj}
        //Tie callbacks to the context
        valueItem.toggleSign = toggleSign(valObj)
        valueItem.onValueChange = onValueChange(valObj)
        valueItem.onGapChange = onGapChange(index, order, gap, factors)
        return valueItem
      } else {
        return { factor, ...valObj }
      }
    })
  return valueList
}

export const getValues = ({ agent }) => {
  activeAgent = agent || activeAgent
  const agentTabs = agents.map(a => ({
    label: a,
    active: a === activeAgent,
    onClick: () => navigate('/values/' + a),
  }))
  return [
    Tabs(agentTabs),
    ValuesTable(getValueList(activeAgent)),
    Button({ label: 'Rescale to 100', onClick: rescaleValues }),
  ]
}
