import { Title } from '../components/global.js'
import { Desc } from '../components/factor.js'
import { userVals, setUserVal } from '../calc/calc.js'
import { updateView } from '../app.js'
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

export const getFactor = ({ key }, { evaluating }) => {
  const content = []
  const domainFactor = domain[key]
  const { title, desc, choice, decidedBy } = domainFactor
  content.push(Title(title))
  if (desc) content.push(Desc(desc))
  let showLegend = true
  if (choice && !decidedBy ) {
    if (evaluating) {
      content.push(getInput(domainFactor))
    } else {
      content.push(getValHistogram(key, showLegend))
      showLegend = false
    }
  }
  for (const source of domainFactor.mergeFrom) {
    const ds = domain[source]
    if (ds.choice && !ds.decidedBy) {
      if (evaluating) {
        content.push(getInput(ds))
      } else {
        content.push(getValHistogram(source, showLegend))
        showLegend = false
      }
    }
  }
  return content
}
