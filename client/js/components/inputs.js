import { camel2space } from '../util.js'
import { types } from '../types.js'
import { html } from '../../third_party/lit-html/lit-html.js'

const RulerDash = (position) => html`
  <div
    class="ruler-dash"
    style=${`left:${position * 100}%`}
  ></div>
`

const RulerNumber = ([position, text]) => html`
  <div
    class="ruler-number"
    style=${`left:calc(${position * 100}% - 1.5em)`}
  >
    ${text}
  </div>
`

export const Ruler = (type) => {
  let positions
  if (window.innerWidth < 960) {
    positions = [0, 0.25, 0.5, 0.75, 1]
  } else {
    positions = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  }
  const {min, max, getText} = types[type]
  const vals = positions.map(
    position => [position, getText(min + (max - min) * position)]
  )
  return html`
    <div class="is-flex">
      <div class="ruler-scale is-flex-one">
        ${positions.map(RulerDash)}
        ${vals.map(RulerNumber)}
      </div>
    </div>
  `
}

export const Slider = (val, cb, {stack, type, sliderLabel, key }) => html`
  <div class="field slider">
    <div>
      ${sliderLabel} = ${types[type].getText(val)}
    </div>
    <div>
      <input
        class="is-fullwidth"
        step=${types[type].step}
        min=${types[type].min}
        max=${types[type].max}
        .value=${val}
        type="range"
        id=${key}
        @change=${(e) => cb(parseFloat(e.target.value))}
      >
      ${(stack) ? '' : Ruler(type)}
    </div>
  </div>
`

export const NumberInput = (value, onChange, disabled) => html`
  <input
    class="input"
    type="number"
    .value=${value}
    @change=${(e) => onChange(parseFloat(e.target.value))}
    min="0"
    max="100"
    step="0.1"
    ?disabled=${disabled}
  >
`
