import { Title } from '../components/global.js'
import { Desc } from '../components/factor.js'
import { userVals, setUserVal } from '../calc/calc.js'
import { updateView } from '../app.js'
import { domain } from '../domain/domain.js'
import { types } from '../types.js'
import { debounce } from '../util.js'

const debState = {}

const getInput = (domainFactor) => {
  const { type, key } = domainFactor
  let onChange = (value) => {
    setUserVal(key, value)
    updateView()
  }
  debState[domainFactor] = debState[domainFactor] || {}
  const onChangeDeb = debounce(onChange, 500, true, debState[domainFactor])
  const { getDefault, getInput } = types[type]
  const inputVal = (key in userVals) ? userVals[key] : getDefault(domain[key])
  const input = getInput(inputVal, onChangeDeb, domainFactor)
  return input
}

export const getFactor = ({ key }) => {
  const content = []
  const domainFactor = domain[key]
  const { title, desc, choice } = domainFactor
  content.push(Title(title))
  if (desc) content.push(Desc(desc))
  if (choice) content.push(getInput(domainFactor))
  for (const source of domainFactor.mergeFrom) {
    const ds = domain[source]
    if (ds.choice) content.push(getInput(ds))
  }
  return content
}
