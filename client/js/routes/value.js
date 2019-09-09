import { Title, Tabs } from '../components/global.js'
import { ValueRegionTable } from '../components/value.js'
import { Arguments, RadioAddon } from '../components/arguments.js'
import { domain } from '../domain/domain.js'
import { userValues } from '../calc/value.js'
import { onValueChange, getValueList } from './values.js'
import { types } from '../types.js'
import { navigate } from '../app.js'
import { debounce } from '../util.js'
import { getValueHistogram } from '../stats.js'

const getValueRegionIndexes = (key, agent, fullList, listSize) => {
  const index = fullList.findIndex(item => item.key === key)
  fullList[index].highlight = true
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
  return { fromIndex, toIndex }
}

//Get combined neihbourhoods of the value items with the keys
const getMultiValueRegion = (keys, agent) => {
  const fullList = getValueList(agent, false)
  const ranges = []
  for (const key of keys) {
    ranges.push(getValueRegionIndexes(key, agent, fullList, 3))
  }
  const valueList = []
  for (let i = 0; i < fullList.length; i++) {
    for (const { fromIndex, toIndex } of ranges) {
      if (i >= fromIndex && i < toIndex) {
        valueList.push(fullList[i])
        break
      }
    }
  }
  return ValueRegionTable(valueList)
}

const getValueRegion = (key, agent) => {
  const fullList = getValueList(agent, false)
  const {fromIndex, toIndex} = getValueRegionIndexes(key, agent, fullList, 5)
  const valueList = fullList.slice(fromIndex, toIndex)
  return ValueRegionTable(valueList)
}

const debState = {}

const getValueInput = (key, updateView, valObj, label, stacked) => {
  const { value, positive } = valObj
  let val = value
  if (!positive) val *= -1
  const sliderOptons = { sliderLabel: label, key }
  if (stacked) {
    sliderOptons.minLabel = ''
    sliderOptons.maxLabel = ''
  }
  debState[valObj.key] = debState[valObj.key] || {}
  const onChange = debounce(onValueChange(updateView, valObj, false), 500, true, debState[valObj.key])
  return types.value.getInput(val, onChange , sliderOptons)
}

const getRadioAddon = (key, agent, field, option, activeOption) => {
  const active = option === activeOption
  const activate = () => navigate(`/value/${key}/${agent}/${option}`)
  return RadioAddon(option, field, active, activate)
}

export const getValue = ({ key, agent, activeOption }, {evaluating, updateView}) => {
  const content = []
  const { title, valuedBy, type, options, valueArguments } = domain[key]
  if (valuedBy.length > 1) {
    const agentTabs = valuedBy.map(a => ({
      label: a,
      active: a === agent,
      onClick: (event) => navigate(`/value/${key}/${a}`, event),
      path: `/value/${key}/${a}`,
    }))
    content.push(Tabs(agentTabs))
  }
  const pageTitle = `Value of "${title}" for ${agent}`
  content.push(Title(pageTitle))
  if (type === 'option') {
    if (evaluating) {
      const valueKeys = Object.keys(options).map(option => key + '_' + option)
      content.push(getMultiValueRegion(valueKeys, agent))
      const optionArray = Object.entries(options)
      for (let i = 0; i < optionArray.length; i++ ) {
        const [option, optionLabel] = optionArray[i]
        const valObj = userValues[agent][key + '_' + option]
        const label = 'Value of ' + optionLabel
        const stacked = i < optionArray.length - 1
        const field = getValueInput(key + '_' + option, updateView, valObj, label, stacked)
        content.push(getRadioAddon(key, agent, field, option, activeOption))
      }
    } else {
      let showLegend = true
      for (const option in options) {
        const field = getValueHistogram(agent, key, option, showLegend)
        showLegend = false
        content.push(getRadioAddon(key, agent, field, option, activeOption))
      }
    }
    if (valueArguments && valueArguments[agent] && valueArguments[agent][activeOption]) {
      content.push(Arguments(valueArguments[agent][activeOption]))
    }
  } else {
    if (evaluating) {
      content.push(getValueRegion(key, agent))
      const valObj = userValues[agent][key]
      content.push(getValueInput(key, updateView, valObj, 'Value'))
    } else {
      content.push(getValueHistogram(agent, key, null, true))
    }
    if (valueArguments && valueArguments[agent]) {
      content.push(Arguments(valueArguments[agent]))
    }
  }
  return { content, title: pageTitle }
}
