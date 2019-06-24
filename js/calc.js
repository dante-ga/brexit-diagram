import { domain } from './domain/domain.js'

export const calcVals = {}

export const setCalcVals = (newVals, runCalc) => {
  Object.assign(calcVals, newVals)
  calculate()
}

export const setValueData = vd =>  calcVals.valueData = vd

const defaultVals = {
  option: ({options}) => Object.keys(options)[0],
  boolean: () => false,
  probability: () => 0.5,
  range: () => 0.5,
  MOTPE: ({optionsFrom}) => {
    //Multiple option three point estimates
    const estimates = {}
    const options = domain[optionsFrom].options
    for (const key in options) {
      estimates[key] = ({
        label: options[key],
        optimistic: 0.25,
        mostLikely: 0.5,
        pessimistic: 0.75,
      })
    }
    return estimates
  }
}

const getAgentValueTotals = () => {
  const totalValues = {}
  const { valueData } = calcVals
  for (const agent in valueData) {
    let total = 0
    for (const valueFactor in valueData[agent]) {
      const valueObj = valueData[agent][valueFactor]
      let {factor = valueFactor, option} = valueObj
      const value = valueObj.value * ((valueObj.positive) ? 1 : -1)
      if (domain[factor].type === 'range') {
        total += calcVals[factor] * value / valueObj.points
      } else if (calcVals[factor] === (option || true)) {
        total += value
      }
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
      val = defaultVals[type](factor)
    } else {
      val = calcVals[key]
    }
    calcVals[key] = val
  }
  calcVals.agentValueTotals = getAgentValueTotals()
}
