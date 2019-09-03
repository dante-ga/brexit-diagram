import { domain, subdomains, getMainDecision } from '../domain/domain.js'
import { types } from '../types.js'
import { getContextValue } from './value.js'
import { persist } from '../persist.js'

export const userVals = {}

const persistPrefix = 'val_'

export const importUserVals = (data) => {
  for (const dataKey in data) {
    if (dataKey.startsWith(persistPrefix)) {
      const key = dataKey.slice(persistPrefix.length)
      if (domain.hasOwnProperty(key)) {
        const { choice, decidedBy } = domain[key]
        if (choice && !decidedBy) {
          userVals[key] = data[dataKey]
        }
      }
    }
  }
}

export const setUserVal = (key, val) => {
  userVals[key] = val
  persist(persistPrefix + key, val)
}

export const hasChoiceMissing = (key) => {
  const { choice, mergeFrom, decidedBy } = domain[key]
  return (choice && !decidedBy && !(key in userVals)) || mergeFrom.some(hasChoiceMissing)
}

export const calcSubs = (context, subs) => {
  for (const sub of subs) {
    const { factors } = subdomains[sub]
    for (const key in factors) {
      const { calc } = factors[key]
      if (calc) {
        context[key] = calc(context)
      }
    }
  }
  return getContextValue(context, subs)
}
