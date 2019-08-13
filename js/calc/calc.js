import { domain, subdomains, getMainDecision } from '../domain/domain.js'
import { types } from '../types.js'
import { getContextValue } from './value.js'

export const userVals = {}
for (const key in domain) {
  if (domain[key].choice && localStorage.getItem('userVal:'+key)) {
    userVals[key] = JSON.parse(localStorage.getItem('userVal:'+key))
  }
}

export const setUserVals = (newVals, runCalc) => {
  Object.assign(userVals, newVals)
  for (const key in newVals) {
    localStorage.setItem('userVal:'+key, JSON.stringify(newVals[key]))
  }
}

export const setTpeUserVal = (key, option, estimate, value) => {
  userVals[key] = userVals[key] || types.tpe.getDefault(domain[key])
  userVals[key][option][estimate] = value
  localStorage.setItem('userVal:'+key, JSON.stringify(userVals[key]))
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
