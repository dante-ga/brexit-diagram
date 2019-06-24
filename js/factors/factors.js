import { Title, Desc, Factors } from '../components/factors.js'
import { Radio, Checkbox, Slider, ThreePointEstimates } from '../components/inputs.js'
import { calcVals, setCalcVals, calculate } from '../calc.js'
import { updateView } from '../app.js'
import { domain, mergeFrom } from '../domain/domain.js'
import { visibleById, GroupingById, Filter } from './grouping.js'

const set = (key) => (value) => {
  setCalcVals({[key]: value})
  updateView()
}

const inputs = {
  option: ({key, options, disableOptions}) => Radio(
    key, options, calcVals[key], set(key),
    disableOptions && disableOptions(calcVals)
  ),
  boolean: ({key}) => Checkbox(key, calcVals[key], set(key)),
  probability: ({key}) => Slider({value: calcVals[key], onChange: set(key) }),
  MOTPE: ({key}) => ThreePointEstimates(
    calcVals[key],
    (option, estimate, value) => {
      //Update deep calcVals value directly
      calcVals[key][option][estimate] = value
      calculate()
      updateView()
    }
  ),
}

const getDomainFactors = () => Object.keys(domain)
  .filter(factorKey => visibleById(factorKey + ':domain') && !domain[factorKey].mergeInto)
  .map(factorKey => {
    const factor = []
    const domainFactor = domain[factorKey]
    const { key, title, type, desc, choice } = domainFactor
    const calcVal = calcVals[key]
    factor.push(Title(title, calcVal, type))
    if (desc) factor.push(Desc(desc))
    if (choice) factor.push(inputs[type](domainFactor))
    const source = mergeFrom[key]
    if (source) {
      const ds = domain[source]
      if (ds.choice) factor.push(inputs[ds.type](ds))
    }
    const grouping = GroupingById(factorKey + ':domain')
    if (grouping) factor.push(grouping)
    return factor
  })

const getValueFactors = () => {
  const valueFactors = []
  for (const agent in calcVals.valueData) {
    const factorVals = calcVals.valueData[agent]
    for (const factorKey in factorVals) {
      const id = factorKey + ':' + agent + ':value'
      if (visibleById(id)) {
        let {value, positive, title} = factorVals[factorKey]
        const fullTitle = `${title} [${agent}\xa0value]`
        if (!positive) value *= -1
        const factor = [ Title(fullTitle, value, 'value') ]
        const grouping = GroupingById(id)
        if (grouping) factor.push(grouping)
        valueFactors.push(factor)
      }
    }
  }
  return valueFactors
}

const getTotalValueFactors = () => {
  const totalValueFactors = []
  for (const agent in calcVals.agentValueTotals) {
    const id = agent + ':totalValue'
    if (visibleById(id)) {
      const title = `Total ${agent} value`
      const value = calcVals.agentValueTotals[agent]
      const factor = [ Title(title, value, 'value') ]
      const grouping = GroupingById(id)
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
