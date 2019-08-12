import { domain, subdomains, getMainDecision } from '../domain/domain.js'
import { types } from '../types.js'
import { getAgentValueTotals, getContextValue } from './value.js'

export const calcVals = {}

export const setCalcVals = (newVals, runCalc) => {
  Object.assign(calcVals, newVals)
  calculate()
  for (const key in newVals) {
    localStorage.setItem('calcVal:'+key, JSON.stringify(newVals[key]))
  }
}

export const setTpeCalcVal = (key, option, estimate, value) => {
  calcVals[key][option][estimate] = value
  calculate()
  localStorage.setItem('calcVal:'+key, JSON.stringify(calcVals[key]))
}

export const setValueData = vd =>  calcVals.valueData = vd

export const calculate = () => {
  for (const key in domain) {
    const factor = domain[key]
    const { type, calc } = factor
    let val
    if (calc) {
      val = calc(calcVals)
    } else if (!calcVals.hasOwnProperty(key)) {
      if (localStorage.getItem('calcVal:'+key)) {
        val = JSON.parse(localStorage.getItem('calcVal:'+key))
      } else {
        val = types[type].getDefault(factor)
      }
    } else {
      val = calcVals[key]
    }
    calcVals[key] = val
  }
  calcVals.agentValueTotals = getAgentValueTotals(calcVals)
  calcVals.mainDecision = getMainDecision(calcVals, calcVals.valueData)
}

export const calcSubs = (context, subs, values) => {
  for (const sub of subs) {
    const { factors } = subdomains[sub]
    for (const key in factors) {
      const { calc } = factors[key]
      if (calc) {
        context[key] = calc(context)
      }
    }
  }
  return getContextValue(context, subs, values)
}
