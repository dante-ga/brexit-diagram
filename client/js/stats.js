import { updateView } from './app.js'
import { Histogram } from './components/stats.js'
import { domain, decisionOptionLabels } from './domain/domain.js'

//TODO: Move these constants into a shared location for the project
const valPref = 'val_'
const valuePref = 'value_'

export let stats

export const getStats = async () => {
  const response = await fetch('/stats.json')
  stats = await response.json()
}

export const getValHistogram = (key, showLegend) => {
  const attr = valPref + key
  const { type, sliderLabel } = domain[key]
  return getHistogram(attr, type, sliderLabel, showLegend)
}

export const getValueHistogram = (agent, key, option, showLegend) => {
  const attr = valuePref + agent + '_' + key + ((option) ? '_' + option : '')
  const sliderLabel = (option) ? domain[key].options[option] : 'Value'
  return getHistogram(attr, 'value', sliderLabel, showLegend)
}

const getHistogram = (attr, type, label, showLegend) => {
  return Histogram(stats.histograms[attr], type, label, decisionOptionLabels, showLegend)
}

export const getImportance = (key, value) => {
  const attr = ((value) ? valuePref : valPref) + key
  return stats.nodeImportances[attr]
}
