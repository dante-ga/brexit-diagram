import { ValuesTable } from './components/values.js'
import { Button, Div } from './components/global.js'
import { Select } from './components/inputs.js'
import { calcVals, calculate, setValueData } from './calc.js'
import { domain } from './domain/domain.js'
import { updateView } from './app.js'

const getInitValueData = () => {
  const valueData = {}
  for (const factor in domain) {
    const { valuedBy, type, options } = domain[factor]
    if (valuedBy) {
      for (const agent of valuedBy) {
        if (!valueData[agent]) {
          valueData[agent] = {}
        }
        if (type === 'boolean') {
          valueData[agent][factor] = {
            positive: true,
            value: 0,
            title: domain[factor].title,
            key: factor,
          }
        } else if (type === 'option') {
          for (const option in options) {
            valueData[agent][factor + ':' + option] = {
              positive: true,
              value: 0,
              factor,
              option,
              title: domain[factor].title + ': ' + domain[factor].options[option],
              key: factor,
            }
          }
        } else if (type === 'range') {
          const points = 10
          valueData[agent][factor] = {
            positive: true,
            value: 0,
            title: `${domain[factor].title} (+${points}\xa0points)`,
            points,
            key: factor,
          }
        } else if (type === 'probability') {
          const percent = 10
          valueData[agent][factor] = {
            positive: true,
            value: 0,
            title: `${domain[factor].title} (+${percent}%)`,
            percent,
            key: factor,
          }
        }
      }
    }
  }
  return valueData
}

const valueData = getInitValueData()
setValueData(valueData)
const agents = Object.keys(valueData)
let activeAgent = agents[0]

const setAgent = (agent) => {
  activeAgent = agent
  updateView()
}

const update = () => {
  calculate()
  updateView()
}

const toggleSign = (valObj) => () => {
  valObj.positive = !valObj.positive
  update()
}

const onValueChange = (valObj) => (newValue) => {
  if (newValue < 0) {
    valObj.value = -newValue
    valObj.positive = !valObj.positive
  } else {
    valObj.value = newValue
  }
  update()
}

const onGapChange = (thisIndex, order, oldGap, factors) => (newGap) => {
  if (newGap < 0) newGap = 0
  const diff = newGap - oldGap
  if (!isNaN(diff)) {
    for (let i = thisIndex; i < order.length; i++) {
      factors[order[i].factor].value += diff
    }
  }
  update()
}

const rescaleValues = () => {
  const factors = valueData[activeAgent]
  const maxValue = Math.max(...Object.keys(factors).map(
    factor => factors[factor].value
  ))
  if (maxValue !== 0) {
    const scale = 100 / maxValue
    Object.keys(factors).forEach(
      factor => factors[factor].value *= scale
    )
    update()
  }
}

function getValueList() {
  let prevValue = 0
  const factors = valueData[activeAgent]
  const valueList = Object.keys(factors)
    .map(factor => ({
      factor,
      value: factors[factor].value,
    }))
    .sort((a, b) => a.value - b.value)
    .map(({factor, value}, index, order) => {
      const gap = value - prevValue
      prevValue = value
      const valObj = factors[factor]
      const valueItem = { factor, gap, refObj: valObj, ...valObj}
      //Tie callbacks to the context
      valueItem.toggleSign = toggleSign(valObj)
      valueItem.onValueChange = onValueChange(valObj)
      valueItem.onGapChange = onGapChange(index, order, gap, factors)
      return valueItem
    })
  return valueList
}

export const getValues = () => {
  const agentOptions = agents.map(agent => ({
    label: agent,
    value: agent,
    selected: agent === activeAgent,
  }))
  return [
    Select('Agent', agentOptions, setAgent),
    ValuesTable(getValueList()),
    Button({ label: 'Rescale to 100', onClick: rescaleValues }),
  ]
}
