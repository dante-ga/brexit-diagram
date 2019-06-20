import { Title, Desc, Factors } from '../components/factors.js'
import { Radio, Checkbox, Slider, ThreePointEstimates } from '../components/inputs.js'
import { calcVals, setCalcVals } from '../calc.js'
import { updateView } from '../app.js'
import { domain, mergeFrom } from '../domain/domain.js'
import { visibleById, GroupingById, Filter } from './grouping.js'

const set = (key) => (value) => {
  setCalcVals({key, value})
  updateView()
}

const inputs = {
  option: ({key, options, disableOptions}) => Radio(
    key, options, calcVals[key], set(key),
    disableOptions && disableOptions(calcVals)
  ),
  boolean: ({key}) => Checkbox(key, calcVals[key], set(key)),
  probability: ({key}) => Slider({value: calcVals[key], onChange: set(key) }),
  MOTPE: ({key}) => ThreePointEstimates(calcVals[key]),
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
    factor.push(GroupingById(factorKey + ':domain'))
    return factor
  })

const getValueFactors = () => {
  const valueFactors = []
  for (const agent in calcVals.valueData) {
    const factorVals = calcVals.valueData[agent]
    for (const factorKey in factorVals) {
      const id = factorKey + ':' + agent + ':value'
      if (visibleById(id)) {
        const title = `${domain[factorKey].title} [${agent}\xa0value]`
        let {value, positive} = factorVals[factorKey]
        if (!positive) value *= -1
        valueFactors.push([
          Title(title, value, 'value'),
          GroupingById(id),
        ])
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
      valueFactors.push([
        Title(title, value, 'value'),
        GroupingById(id),
      ])
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
