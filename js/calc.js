import { domain } from './domain/domain.js'
import { types } from './types.js'

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

const getAgentValueTotals = () => {
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
  calcVals.agentValueTotals = getAgentValueTotals()
}
