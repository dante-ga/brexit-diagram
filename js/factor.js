import { Title, Desc } from './components/factor.js'
import { userVals, setUserVals, setTpeUserVal } from './calc/calc.js'
import { updateView } from './app.js'
import { domain } from './domain/domain.js'
import { types } from './types.js'

const getInput = (domainFactor) => {
  const { type, key } = domainFactor
  let onChange
  if (type === 'tpe') {
    onChange = (option, estimate, value) => {
      setTpeUserVal(key, option, estimate, value)
      updateView()
    }
  } else {
    onChange = (value) => {
      setUserVals({[key]: value})
      updateView()
    }
  }
  const { getDefault, getInput } = types[type]
  const inputVal = (key in userVals) ? userVals[key] : getDefault(domain[key])
  const input = getInput(inputVal, onChange, domainFactor)
  return input
}

export const getFactor = (factorKey) => {
  const factor = []
  const domainFactor = domain[factorKey]
  const { title, desc, choice } = domainFactor
  factor.push(Title(title))
  if (desc) factor.push(Desc(desc))
  if (choice) factor.push(getInput(domainFactor))
  for (const source of domainFactor.mergeFrom) {
    const ds = domain[source]
    if (ds.choice) factor.push(getInput(ds))
  }
  return factor
}
