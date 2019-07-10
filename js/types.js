import { round2tenth, camel2space } from './util.js'
import { Radio, Checkbox, Slider } from './components/inputs.js'
import { ThreePointEstimates } from './components/tpe.js'
import { domain } from './domain/domain.js'

const valuePercent = 10

export const types = {
  boolean: {
    getDefault: () => false,
    getText: val => (val) ? 'YES' : 'NO',
    getColor: val => (val) ? 'is-success' : 'is-danger',
    getInput: (val, cb, df) => Checkbox(val, cb, df),
    getValueObjs: ({key, title}) => ({[key]: {title}}),
    getValue: (val, value) => (val) ? value : 0,
  },
  option: {
    getDefault: ({options}) => Object.keys(options)[0],
    getText: val => camel2space(val),
    getColor: () => 'is-dark',
    getInput: (val, cb, df, calcVals) => Radio(val, cb, {
      disabled: df.disableOptions && df.disableOptions(calcVals),
      ...df,
    }),
    getValueObjs: ({key, title, options}) => {
      const valueObjs = {}
      for (const option in options) {
        valueObjs[key + ':' + option] = {
          factor: key,
          option,
          title: title + ': ' + options[option],
        }
      }
      return valueObjs
    },
    getValue: (val, value, {option}) => (val === option) ? value : 0,
  },
  agentValue: {
    getDefault: () => 0,
    getText: val => round2tenth(val),
    getColor: (val) => (val === 0) ? 'is-dark' : ((val > 0) ? 'is-success' : 'is-danger'),
  },
  unitInterval: {
    getDefault: () => 0.5,
    getText: val => round2tenth(val * 100) + '%',
    getColor: () => 'is-dark',
    getInput: (val, cb, df) => Slider(val, cb, {
      min: 0,
      max: 1,
      step: 0.005,
      ...df
    }),
    getValueObjs: ({key, title}) => ({[key]: {
      percent: valuePercent,
      title: `${title} (+${valuePercent}%)`,
    }}),
    getValue: (val, value, {percent}) => val * value / percent * 100,
  },
  mirrorUnitInterval: {
    getDefault: () => 0,
    getText: val => ((val > 0) ? '+' : '') + Math.round(val * 100) + '%',
    getColor: val => (val === 0) ? 'is-dark' : ((val > 0) ? 'is-success' : 'is-danger'),
    getInput: (val, cb, df) => Slider(val, cb, {
      min: -1,
      max: 1,
      step: 0.01,
      minLabel: 'Decrease',
      maxLabel: 'Increase',
      ...df
    }),
    getValueObjs: ({key, title}) => ({[key]: {
      percent: valuePercent,
      title: `${title} (+${valuePercent}%)`,
    }}),
    getValue: (val, value, {percent}) => val * value / percent * 100,
  },
  ratio: {
    getDefault: () => 1,
    getText: val => val,
    getColor: val => (val === 1) ? 'is-dark' : ((val > 1) ? 'is-success' : 'is-danger'),
    getInput: (val, cb, df) => Slider(val, cb, {
      min: 0,
      max: 3,
      step: 0.01,
      sliderLabel: 'Impact ratio',
      minLabel: 'No impact',
      maxLabel: 'Drastic impact',
      ...df
    }),
  },
  mirrorRatio: {
    getDefault: () => 0,
    getText: val => val,
    getColor: val => (val === 0) ? 'is-dark' : ((val > 0) ? 'is-success' : 'is-danger'),
    getInput: (val, cb, df) => Slider(val, cb, {
      min: -3,
      max: 3,
      step: 0.01,
      sliderLabel: 'Impact ratio',
      minLabel: 'Decrease',
      maxLabel: 'Increase',
      ...df
    })
  },
  tpe: {
    getDefault: ({optionsFrom}) => {
      //Multiple option three point estimates
      const estimates = {}
      const options = domain[optionsFrom].options
      for (const key in options) {
        estimates[key] = ({
          label: options[key],
          optimistic: 0.25,
          mostLikely: 0.5,
          pessimistic: 0.75,
        })
      }
      return estimates
    },
    getInput: (val, cb, df) => ThreePointEstimates(val, cb, df),
  }
}
