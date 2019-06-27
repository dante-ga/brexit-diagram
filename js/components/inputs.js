// import { updateView } from '../app.js'
import { camel2space } from '../util.js'
const { html } = lighterhtml

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

export const Radio = (name, options, value, onChange, disabled) => {
  const radioOptions = Object.keys(options).map(
    (optionValue) => ({
      value: optionValue,
      label: options[optionValue],
      checked: optionValue === value,
      name,
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

export const Checkbox = (id, checked, choiceLabel, onChange) => html`
  <div class="field">
    <input
      class="is-checkradio"
      type="checkbox"
      checked=${checked}
      onchange=${(e) => onChange(e.target.checked)}
      id=${id}
    >
    <label for=${id} >
      ${choiceLabel}
    </label>
  </div>
`

export const Slider = ({value, onChange, settings}) => {
  settings = settings || ({
    min: 'Impossible',
    max: 'Definitely',
    label: 'Probability P',
  })
  const label = `${settings.label} = ${(value * 100).toFixed(1)}%`
  return html`
    <div class="field">
      <div>${label}</div>
      <div>
        <input
          class="is-fullwidth"
          step="0.005"
          min="0"
          max="1"
          value=${value}
          type="range"
          onchange=${(e) => onChange(parseFloat(e.target.value))}
        >
        <div>
          <span>
            ${settings.min}
          </span>
          <span class="is-pulled-right">
            ${settings.max}
          </span>
        </div>
      </div>
    </div>
  `
}

const getRangeValue = (e) => {
  if (e.clientX === 0) return null
  const rect = e.target.parentElement.getBoundingClientRect()
  let value = (e.clientX - rect.left) / rect.width
  value = Math.min(Math.max(value, 0), 1)
  return value
}

const onTpePointDrag = (e, est, pointWidth) => {
  const value = getRangeValue(e)
  if (value === null) return false
  //Update DOM styles without updating the whole view
  e.target.style.left = `calc(${value * 100}% - ${pointWidth/2}px)`
  if (est === 'optimistic') {
    e.target.parentElement.querySelector('.tpe-range').style.left = value * 100 + '%'
  } else if (est === 'pessimistic') {
    e.target.parentElement.querySelector('.tpe-range').style.right = (1 - value) * 100 + '%'
  }
}

const onTpePointDragEnd = (e, onEnd) => {
  const value = getRangeValue(e)
  if (value === null) return false
  onEnd(value)
}

const clearDragImage = (e) => e.dataTransfer
  .setDragImage(document.createElement('img'), 0, 0);

const TpePoint = ({value, option, est, onChange}) => {
  const left = value * 100
  const pointWidth = 6;
  const style = `left: calc(${left}% - ${pointWidth/2}px);`
  const onEnd = (val) => onChange(option, est, val)
  return html`
    <div
      class="tpe-point"
      style=${style}
      draggable="true"
      ondrag=${(e) => onTpePointDrag(e, est, pointWidth)}
      ondragend=${(e) => onTpePointDragEnd(e, onEnd)}
      ondragstart=${clearDragImage}
    />
  `
}

const TpeOption = ({option, estimate, onChange}) => html`
  <div class="is-flex field" >
    <div  class="is-size-7 tpe-option-label tpe-padding">
      ${camel2space(option)}
    </div>
    <div class="tpe-scale is-flex-one">
      <div class="tpe-range" style=${`
        left:${estimate.optimistic * 100}%;
        right:${(1 - estimate.pessimistic) * 100}%;
      `} />
      ${['optimistic', 'mostLikely', 'pessimistic'].map((est) => TpePoint({
        value: estimate[est],
        option,
        est,
        onChange,
      }))}
    </div>
  </div>
`

const TpeRulerDash = (value) => html`
  <div
    class="tpe-ruler-dash"
    style=${`left:${value}%`}
  />
`

const TpeRulerNumber = (value) => html`
  <div
    class="tpe-ruler-number"
    style=${`left:calc(${value}% - 1.5em)`}
  >
    ${value}
  </div>
`

const TpeRuler = () => {
  const dashes = []
  for (let i = 0; i <= 10; i++) {
    dashes.push(i * 10)
  }
  const numbers = [0, 25, 50, 75, 100]
  return html`
    <div class="is-flex">
      <div class="tpe-padding" />
      <div class="tpe-ruler-scale is-flex-one">
        ${dashes.map(TpeRulerDash)}
        ${numbers.map(TpeRulerNumber)}
      </div>
    </div>
  `
}

export const ThreePointEstimates = (key, optionEstimates, onChange) => {
  const options = []
  for (const option in optionEstimates) {
    const estimates = []
    options.push({
      option,
      estimate: optionEstimates[option],
      onChange,
    })
  }
  return html`
    <div class="field is-size-7">
      ${options.map(TpeOption)}
      ${TpeRuler()}
    </div>
  `
}

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

const Option = ({label, value, selected}) => html`
  <option value=${value} selected="${selected}" >
    ${label}
  </option>
`

export const Select = (label, options, onChange) => html`
  <div class="field">
    <span class="has-text-weight-bold is-va-middle" >${label}: &nbsp;</span>
    <span class="select is-va-middle">
      <select onchange=${(e) => onChange(e.target.value)} class="select">
        ${options.map(Option)}
      </select>
    </span>
  </div>
`
