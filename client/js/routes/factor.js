import { Title } from '../components/global.js'
import { Desc } from '../components/factor.js'
import { Arguments, RadioAddon } from '../components/arguments.js'
import { userVals, setUserVal } from '../calc/calc.js'
import { updateView, navigate } from '../app.js'
import { domain } from '../domain/domain.js'
import { types } from '../types.js'
import { debounce } from '../util.js'
import { getValHistogram } from '../stats.js'

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

export const getFactor = ({ key, activeKey }, { evaluating }) => {
  const content = []
  const domainFactor = domain[key]
  const { title, desc, choice, decidedBy } = domainFactor
  content.push(Title(title))
  if (desc) content.push(Desc(desc))

  const fieldKeys = []
  if (choice && !decidedBy ) {
    fieldKeys.push(key)
  }
  for (const source of domainFactor.mergeFrom) {
    const ds = domain[source]
    if (ds.choice && !ds.decidedBy) {
      fieldKeys.push(source)
    }
  }
  const multipleFields = fieldKeys.length > 1
  let _arguments
  for (let i = 0; i < fieldKeys.length; i++) {
    const fieldKey = fieldKeys[i]
    const active = (fieldKey === activeKey) || !multipleFields
    const factor = domain[fieldKey]
    let field
    if (evaluating) {
      field = getInput(factor)
    } else {
      const first = i === 0
      field = getValHistogram(fieldKey, first)
    }
    if (multipleFields) {
      const activate = () => navigate('/factor/'+key+'/'+fieldKey)
      content.push(RadioAddon(fieldKey, field, active, activate))
    } else {
      content.push(field)
    }
    if (active) {
      _arguments = factor.arguments
    }
  }
  if (_arguments) {
    content.push(Arguments(_arguments))
  }
  return { content, title }
}
