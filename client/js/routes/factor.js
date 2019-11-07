import { Title, Tabs, ButtonSection } from '../components/global.js'
import { Desc, Question, CalcDesc } from '../components/factor.js'
import { RadioAddon } from '../components/arguments.js'
import { getArguments } from '../arguments.js'
import { userVals, setUserVal } from '../calc/calc.js'
import { updateView, navigate } from '../app.js'
import { domain } from '../domain/domain.js'
import { types } from '../types.js'
import { debounce } from '../util.js'
import { getValHistogram } from '../stats.js'
import { Slider } from '../components/inputs.js'

const debState = {}

const getInput = (domainFactor, stack) => {
  const { type, key } = domainFactor
  let onChange = (value) => {
    setUserVal(key, value)
    updateView()
  }
  debState[domainFactor] = debState[domainFactor] || {}
  const onChangeDeb = debounce(onChange, 500, true, debState[domainFactor])
  const { getDefault } = types[type]
  const inputVal = (key in userVals) ? userVals[key] : getDefault(domain[key])
  const input = Slider(inputVal, onChangeDeb, Object.assign({stack}, domainFactor))
  return input
}

export const getFieldKeys = (key) => {
  const { choice, mergeFrom } = domain[key]
  const fieldKeys = []
  if (choice) {
    fieldKeys.push(key)
  }
  for (const source of mergeFrom) {
    const ds = domain[source]
    if (ds.choice) {
      fieldKeys.push(source)
    }
  }
  return fieldKeys
}

export const getFactor = ({ key, activeKey }, { evaluating, setEvaluation, updateView, navigate }) => {
  const content = []
  const domainFactor = domain[key]
  const { title, desc, question, calcDesc, valuedBy } = domainFactor
  content.push(Title(title))
  if (valuedBy) {
    content.push(ButtonSection({
      label: 'Go to value',
      onClick: (event) => navigate('/value/'+key+'/'+valuedBy[0], event)
    }))
  }

  const fieldKeys = getFieldKeys(key)
  const hasFields = fieldKeys.length > 0
  const multipleFields = fieldKeys.length > 1

  if (question) content.push(Question(question))
  if (desc) content.push(Desc(desc))

  if (hasFields) {
    content.push(Tabs([
      {
        label: 'Your answer',
        active: evaluating,
        onClick: () => setEvaluation(true),
      },
      {
        label: 'Statistics',
        active: !evaluating,
        onClick: () => setEvaluation(false),
      },
    ]))
    if (multipleFields && !activeKey) {
      activeKey = fieldKeys[0]
    }
    let _arguments = null
    let path
    for (let i = 0; i < fieldKeys.length; i++) {
      const fieldKey = fieldKeys[i]
      const active = (fieldKey === activeKey) || !multipleFields
      const factor = domain[fieldKey]
      let field
      if (evaluating) {
        const stack = fieldKeys[i+1] && (domain[fieldKeys[i+1]].type === factor.type)
        field = getInput(factor, stack)
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
        path = ['factor', key, fieldKey].join('_')
      }
    }
    content.push(getArguments(_arguments, multipleFields, path, updateView))
  }
  if (calcDesc) content.push(CalcDesc(calcDesc))
  return { content, title }
}
