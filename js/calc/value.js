import { types } from '../types.js'
import { domain } from '../domain/domain.js'

export const getAgentValueTotals = (calcVals) => {
  const totalValues = {}
  const { valueData } = calcVals
  for (const agent in valueData) {
    let total = 0
    for (const valueFactor in valueData[agent]) {
      const valueObj = valueData[agent][valueFactor]
      const factor = valueObj.factor || valueFactor
      const value = valueObj.value * ((valueObj.positive) ? 1 : -1)
      const typeObj = types[domain[factor].type]
      total += typeObj.getValue(calcVals[factor], value, valueObj)
    }
    totalValues[agent] = total
  }
  return totalValues
}

export const getContextValue = (context, subs, valueData) => {
  const totalValues = {}
  for (const agent in valueData) {
    let total = 0
    for (const valueFactor in valueData[agent]) {
      const valueObj = valueData[agent][valueFactor]
      const factor = valueObj.factor || valueFactor
      if (subs.includes(domain[factor].subKey)) {
        const value = valueObj.value * ((valueObj.positive) ? 1 : -1)
        const typeObj = types[domain[factor].type]
        total += typeObj.getValue(context[factor], value, valueObj)
      }
    }
    totalValues[agent] = total
  }
  return totalValues
}

//How to access to values variable?
//Some keys are composite, such as border options
export const getAgentValue = (key, val, agent, valueData) => {
  // console.log({valueData, agent, key})
  const { type } = domain[key]
  const valueKey = key + ((type === 'option') ? ':' + val : '')
  const valueObj = valueData[agent][valueKey]
  const value = valueObj.value * ((valueObj.positive) ? 1 : -1)
  return types[type].getValue(val, value, valueObj)
}
