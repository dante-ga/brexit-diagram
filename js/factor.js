import { Title, Desc } from './components/factor.js'
import { calcVals, setCalcVals, setTpeCalcVal } from './calc/calc.js'
import { updateView } from './app.js'
import { domain } from './domain/domain.js'
import { types } from './types.js'

const getInput = (domainFactor) => {
  const { type, key } = domainFactor
  let onChange
  if (type === 'tpe') {
    onChange = (option, estimate, value) => {
      setTpeCalcVal(key, option, estimate, value)
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

const getTag = (val, type) => ({
  text: types[type].getText(val),
  color: types[type].getColor(val),
})

export const getFactor = (factorKey) => {
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
  return factor
}
