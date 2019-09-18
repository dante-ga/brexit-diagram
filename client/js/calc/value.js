import { types } from '../types.js'
import { domain } from '../domain/domain.js'

export let userValues
export const setUserValues = uvs => userValues = uvs

export const getContextValue = (context, subs) => {
  const totalValues = {}
  const subNodeValues = {}
  for (const agent in userValues) {
    let total = 0
    const nodes = {}
    for (const valueFactor in userValues[agent]) {
      const valueObj = userValues[agent][valueFactor]
      const factor = valueObj.factor || valueFactor
      const {subKey, type, customCalc} = domain[factor]
      if (subs.includes(subKey) && !customCalc) {
        const value = valueObj.value * ((valueObj.positive) ? 1 : -1)
        const typeObj = types[type]
        const finalValue = typeObj.getValue(context[factor], value, valueObj)
        total += finalValue
        nodes[factor] = finalValue
      }
    }
    totalValues[agent] = total
    subNodeValues[agent] = nodes
  }
  return { totalValues, subNodeValues }
}

export const getAgentValue = (key, val, agent) => {
  const { type } = domain[key]
  const valueKey = key + ((type === 'option') ? '_' + val : '')
  const valueObj = userValues[agent][valueKey]
  const value = valueObj.value * ((valueObj.positive) ? 1 : -1)
  return types[type].getValue(val, value, valueObj)
}

export const hasMissingValues = (key) => {
  for (const agent in userValues) {
    for (const valueFactor in userValues[agent]) {
      const {factor, touched} = userValues[agent][valueFactor]
      if ((valueFactor === key || factor === key) && !touched) {
        return { missing: true, key, agent }
      }
    }
  }
  return { missing: false }
}
