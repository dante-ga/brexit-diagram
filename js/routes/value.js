import { Title } from '../components/global.js'
import { ValueRegionTable } from '../components/value.js'
import { domain } from '../domain/domain.js'
import { userValues } from '../calc/value.js'
import { onValueChange, getValueList } from './values.js'
import { types } from '../types.js'

const getValueRegion = (key, agent) => {
  const fullList = getValueList(agent, false)
  const index = fullList.findIndex(({factor}) => factor === key)
  const listSize = 5
  let fromIndex = index
  let toIndex = index + 1
  let forward = toIndex < fullList.length
  for (let n = 1; n < listSize; n++) {
    if (forward) {
      toIndex++
      if (fromIndex > 0) forward = false
    } else {
      if (fromIndex === 0) break
      fromIndex--
      if (toIndex < fullList.length) forward = true
    }
  }
  const valueList = fullList.slice(fromIndex, toIndex)
  return ValueRegionTable(valueList)
}

//CONTINUE HERE!!
//CONTINUE HERE!!
//CONTINUE HERE!!
//TODO: remove notification and make progress (probably in values.js)
export const getValue = ({ key }) => {
  const { title, valuedBy } = domain[key]
  //TODO: handle multiple agents
  const agent = valuedBy[0]
  //TODO: handle complex keys
  const valObj = userValues[agent][key]
  const { value, positive } = valObj
  let val = value
  if (!positive) val *= -1
  const valueRegion = getValueRegion(key, agent)
  const input = types.value.getInput(val, onValueChange(valObj, false), agent)
  return [
    Title(title),
    valueRegion,
    input,
  ]
}
