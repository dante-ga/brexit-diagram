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

export const Radio = (name, options, value, onChange, disabled = []) => {
  const radioOptions = Object.keys(options).map(
    (optionValue) => ({
      value: optionValue,
      label: options[optionValue],
      checked: optionValue === value,
      name,
      onChange,
      disabled: disabled.includes(optionValue)
    })
  )
  return html`
    <div class="field">
      ${radioOptions.map(RadioOption)}
    </div>
  `
}

export const Checkbox = (id, checked, onChange) => html`
  <div class="field">
    <input
      class="is-checkradio"
      type="checkbox"
      checked=${checked}
      onchange=${(e) => onChange(e.target.checked)}
      id=${id}
    >
    <label for=${id} >Intends</label>
  </div>
`

export const Slider = ({value, onChange}) => {
  const label = `Probability P = ${(value * 100).toFixed(1)}%`
  return html`
    <br>
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
          onchange=${(e) => onChange(e.target.value)}
        >
        <div>
          <span>Impossible</span>
          <span class="is-pulled-right">Definitely</span>
        </div>
      </div>
    </div>
  `
}

const TpeSlider = ({label, value}) => html`
  <div class="is-flex">
    <span class="has-text-right" style="width: 70px; padding-right: 10px;">
      ${label} = ${value * 100}
    </span>
    <input
      style="flex: 1;"
      step="0.01"
      min="0"
      max="1"
      value=${value}
      type="range"
    >
  </div>
`

const ThreePointEstimate = (label, sliders) => html`
  <div class="field">
    <div style="padding-left: 70px;">
      ${label}
    </div>
    ${sliders.map(TpeSlider)}
  </div>
`

export const ThreePointEstimates = (optionEstimates) => {
  const options = optionEstimates.map(({label, optimistic, mostLikely, pessimistic}) => {
    const sliders = [
      {label: 'O', value: optimistic},
      {label: 'ML', value: mostLikely},
      {label: 'P', value: pessimistic},
    ]
    return ThreePointEstimate(label, sliders)
  })
  return html`
    <br>
    ${options}
    <div>
      <span style="padding-left: 70px;">Most peaceful</span>
      <span class="is-pulled-right">Most violent</span>
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
  <option value=${value} selected=${selected} >
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
