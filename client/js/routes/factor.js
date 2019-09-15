import { Title, Tabs } from '../components/global.js'
import { Desc, Question, CalcDesc } from '../components/factor.js'
import { Arguments, RadioAddon } from '../components/arguments.js'
import { userVals, setUserVal } from '../calc/calc.js'
import { updateView, navigate } from '../app.js'
import { domain } from '../domain/domain.js'
import { types } from '../types.js'
import { debounce } from '../util.js'
import { getValHistogram } from '../stats.js'
import { getCommentsButton } from '../comments.js'

const debState = {}

const getInput = (domainFactor, stack) => {
  const { type, key } = domainFactor
  let onChange = (value) => {
    setUserVal(key, value)
    updateView()
  }
  debState[domainFactor] = debState[domainFactor] || {}
  const onChangeDeb = debounce(onChange, 500, true, debState[domainFactor])
  const { getDefault, getInput } = types[type]
  const inputVal = (key in userVals) ? userVals[key] : getDefault(domain[key])
  const input = getInput(inputVal, onChangeDeb, {stack, ...domainFactor})
  return input
}

export const getFactor = ({ key, activeKey }, { evaluating, setEvaluation, updateView }) => {
  const content = []
  const domainFactor = domain[key]
  const { title, desc, choice, calcDesc } = domainFactor
  content.push(Title(title))
  if (desc) {
    if (choice) {
      content.push(Question(desc))
    } else {
      content.push(Desc(desc))
    }
  }
  if (calcDesc) {
      content.push(CalcDesc(calcDesc))
  }

  const fieldKeys = []
  if (choice) {
    fieldKeys.push(key)
  }
  for (const source of domainFactor.mergeFrom) {
    const ds = domain[source]
    if (ds.choice) {
      fieldKeys.push(source)
    }
  }
  const hasFields = fieldKeys.length > 0
  const multipleFields = fieldKeys.length > 1
  if (hasFields) {
    content.push(Tabs([
      {
        label: 'Your answer',
        active: evaluating,
        onClick: () => setEvaluation(true)
      },
      {
        label: 'Statistics',
        active: !evaluating,
        onClick: () => setEvaluation(false)
      },
    ]))
    let _arguments = null
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
      }
    }
    content.push(Arguments(_arguments))
    if (_arguments !== null) {
      content.push(getCommentsButton(updateView))
    }
  }
  return { content, title }
}
