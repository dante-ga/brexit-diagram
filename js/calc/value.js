import { types } from '../types.js'
import { domain } from '../domain/domain.js'

export let userValues
export const setUserValues = uvs => userValues = uvs

export const getContextValue = (context, subs) => {
  const totalValues = {}
  for (const agent in userValues) {
    let total = 0
    for (const valueFactor in userValues[agent]) {
      const valueObj = userValues[agent][valueFactor]
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

export const getAgentValue = (key, val, agent) => {
  const { type } = domain[key]
  const valueKey = key + ((type === 'option') ? ':' + val : '')
  const valueObj = userValues[agent][valueKey]
  const value = valueObj.value * ((valueObj.positive) ? 1 : -1)
  return types[type].getValue(val, value, valueObj)
}

export const hasMissingValues = (key) => {
  for (const agent in userValues) {
    for (const valueFactor in userValues[agent]) {
      const {factor, touched} = userValues[agent][valueFactor]
      if ((valueFactor === key || factor === key) && !touched) {
        return true
      }
    }
  }
  return false
}
