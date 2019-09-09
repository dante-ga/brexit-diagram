import { camel2space } from '../util.js'
import { types } from '../types.js'
const { html } = lighterhtml

export const Checkbox = (checked, onChange, { key, checkboxLabel, disabled }) => html`
  <div class="field">
    <input
      class="is-checkradio"
      type="checkbox"
      checked=${checked}
      onchange=${(e) => onChange(e.target.checked)}
      id=${key}
      disabled=${disabled}
    >
    <label for=${key} >
      ${checkboxLabel}
    </label>
  </div>
`

const RadioOption = ({name, label, value, checked, onChange, disabled}) => html`
  <label class="radio">
    <input
      class="is-checkradio"
      type="radio"
      name=${name}
      id=${name + '_eq_' + value}
      value=${value}
      checked=${checked}
      onchange=${(e) => onChange(e.target.value)}
      disabled=${disabled}
    >
    <label for=${name + '_eq_' + value} >${label}</label>
  </label>
  <br>
`

export const Radio = (value, onChange, {key, options, disabled}) => {
  const radioOptions = Object.keys(options).map(
    (optionValue) => ({
      value: optionValue,
      label: options[optionValue],
      checked: optionValue === value,
      name: key,
      onChange,
      disabled: disabled && disabled.includes(optionValue)
    })
  )
  return html`
    <div class="field">
      ${radioOptions.map(RadioOption)}
    </div>
  `
}

//TODO: remove dependency on "type"
export const Slider = (val, cb, { type, step, sliderLabel, minLabel, maxLabel, key }) => html`
  <div class="field slider">
    <div>
      ${sliderLabel} = ${types[type].getText(val)}
    </div>
    <div>
      <input
        class="is-fullwidth"
        step=${step}
        min=${types[type].min}
        max=${types[type].max}
        value=${val}
        type="range"
        id=${key}
        onchange=${(e) => cb(parseFloat(e.target.value))}
      >
      <div>
        <span>${minLabel}</span>
        <span class="is-pulled-right">${maxLabel}</span>
      </div>
    </div>
  </div>
`

export const NumberInput = (value, onChange, disabled) => html`
  <input
    class="input"
    type="number"
    value=${value}
    onchange=${(e) => onChange(parseFloat(e.target.value))}
    min="0"
    max="100"
    step="0.1"
    disabled=${disabled}
  >
`
