import { Title, Desc, Factors } from '../components/factors.js'
import { calcVals, setCalcVals, calculate } from '../calc.js'
import { updateView } from '../app.js'
import { domain } from '../domain/domain.js'
import { isVisible, getGrouping, Filter } from './grouping.js'
import { types } from '../types.js'

export const getInput = (domainFactor) => {
  const { type, key } = domainFactor
  let onChange
  if (type === 'tpe') {
    onChange = (option, estimate, value) => {
      //Update deep calcVals value directly
      calcVals[key][option][estimate] = value
      calculate()
      updateView()
    }
  } else {
    onChange = (value) => {
      setCalcVals({[key]: value})
      updateView()
    }
  }
  const input = types[type].getInput(calcVals[key], onChange, domainFactor, calcVals)
  return input
}

export const getTag = (val, type) => ({
  text: types[type].getText(val),
  color: types[type].getColor(val),
})

const getDomainFactors = () => Object.keys(domain)
  .filter(factorKey => isVisible(factorKey + ':domain', factorKey)
    && !domain[factorKey].mergeInto)
  .map(factorKey => {
    const factor = []
    const domainFactor = domain[factorKey]
    const { key, title, type, desc, choice } = domainFactor
    const calcVal = calcVals[key]
    factor.push(Title(title, getTag(calcVal, type)))
    if (desc) factor.push(Desc(desc))
    if (choice) factor.push(getInput(domainFactor))
    for (const source of domainFactor.mergeFrom) {
      const ds = domain[source]
      if (ds.choice) factor.push(getInput(ds))
    }
    const grouping = getGrouping(factorKey + ':domain', factorKey)
    if (grouping) factor.push(grouping)
    return factor
  })

const getValueFactors = () => {
  const valueFactors = []
  for (const agent in calcVals.valueData) {
    const factorVals = calcVals.valueData[agent]
    for (const factorKey in factorVals) {
      const id = factorKey + ':' + agent + ':value'
      let {value, positive, title, key, factor} = factorVals[factorKey]
      const domainFactor = factor || key
      if (isVisible(id, domainFactor)) {
        const fullTitle = `${title} [${agent}\xa0value]`
        if (!positive) value *= -1
        const factorComp = [ Title(fullTitle, getTag(value, 'agentValue')) ]
        const grouping = getGrouping(id, domainFactor)
        if (grouping) factorComp.push(grouping)
        valueFactors.push(factorComp)
      }
    }
  }
  return valueFactors
}

const getTotalValueFactors = () => {
  const totalValueFactors = []
  for (const agent in calcVals.agentValueTotals) {
    const id = agent + ':totalValue'
    if (isVisible(id, null)) {
      const title = `Total ${agent} value`
      const value = calcVals.agentValueTotals[agent]
      const factor = [ Title(title, getTag(value, 'agentValue')) ]
      const grouping = getGrouping(id, null)
      if (grouping) factor.push(grouping)
      totalValueFactors.push(factor)
    }
  }
  return totalValueFactors
}


export const getFactors = () => [
  Filter(),
  Factors([
    ...getDomainFactors(),
    ...getValueFactors(),
    ...getTotalValueFactors(),
  ]),
]
