import { Title, Desc, Factors } from '../components/factors.js'
import { Radio, Checkbox, Slider, ThreePointEstimates } from '../components/inputs.js'
import { calcVals, setCalcVals, calculate } from '../calc.js'
import { updateView } from '../app.js'
import { domain } from '../domain/domain.js'
import { isVisible, getGrouping, Filter } from './grouping.js'

const set = (key) => (value) => {
  setCalcVals({[key]: value})
  updateView()
}

const inputs = {
  option: ({key, options, disableOptions}) => Radio(
    key, options, calcVals[key], set(key),
    disableOptions && disableOptions(calcVals)
  ),
  boolean: ({key, choiceLabel}) => Checkbox(key, calcVals[key], choiceLabel, set(key)),
  probability: ({key, probability}) => Slider({
    value: calcVals[key],
    onChange: set(key),
    settings: probability,
  }),
  ratio: ({key, ratio}) => Slider({
    value: calcVals[key],
    onChange: set(key),
    settings: { type: 'ratio', ...ratio },
  }),
  change: ({key, change}) => Slider({
    value: calcVals[key],
    onChange: set(key),
    settings: change,
  }),
  MOTPE: ({key}) => ThreePointEstimates(
    key,
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
  .filter(factorKey => isVisible(factorKey + ':domain', factorKey)
    && !domain[factorKey].mergeInto)
  .map(factorKey => {
    const factor = []
    const domainFactor = domain[factorKey]
    const { key, title, type, desc, choice } = domainFactor
    const calcVal = calcVals[key]
    factor.push(Title(title, calcVal, type))
    if (desc) factor.push(Desc(desc))
    if (choice) factor.push(inputs[type](domainFactor))
    for (const source of domainFactor.mergeFrom) {
      const ds = domain[source]
      if (ds.choice) factor.push(inputs[ds.type](ds))
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
      let {value, positive, title, key} = factorVals[factorKey]
      if (isVisible(id, key)) {
        const fullTitle = `${title} [${agent}\xa0value]`
        if (!positive) value *= -1
        const factor = [ Title(fullTitle, value, 'value') ]
        const grouping = getGrouping(id, key)
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
    if (isVisible(id, null)) {
      const title = `Total ${agent} value`
      const value = calcVals.agentValueTotals[agent]
      const factor = [ Title(title, value, 'value') ]
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
