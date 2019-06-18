import { NumberInput } from './inputs.js'
import { round2tenth } from '../util.js'
const { html } = lighterhtml

export const Sign = (positive, toggle) => {
  let iconClass, spanColor, disabled
  let buttonClass = 'button'
  if (positive === true) {
    iconClass = 'fas fa-plus'
    spanColor = 'has-text-success'
    disabled = false
  } else if (positive === false) {
    iconClass = 'fas fa-minus'
    spanColor = 'has-text-danger'
    disabled = false
  } else if (positive === null) {
    iconClass = 'far fa-circle'
    spanColor = ''
    disabled = true
    buttonClass = 'button is-static'
  }
  const spanClass = ['icon', spanColor].join(' ')
  return html`
    <button class=${buttonClass} onclick=${toggle} >
      <span class=${spanClass}>
        <i class=${iconClass} />
      </span>
    </button>
  `
}

const ValueRow = ({factor, positive, value, gap, title, toggleSign, onValueChange, onGapChange, refObj}) => html.for(refObj)`
  <tr>
    <td>${Sign((value === 0) ? null : positive, toggleSign)}</td>
    <td>${NumberInput(round2tenth(value), onValueChange)}</td>
    <td class="is-gap">${NumberInput(round2tenth(gap), onGapChange)}</td>
    <td class="is-va-middle">${title}</td>
  </tr>
`

export const ValuesTable = (valueList) => html`
<table class="table is-fullwidth">
  <thead>
    <tr>
      <th>Sign</th>
      <th>Value</th>
      <th>Gap</th>
      <th>Factor</th>
    </tr>
  </thead>
  <tbody>
    ${valueList.reverse().map(ValueRow)}
    <tr>
      <td>${Sign(null)}</td>
      <td>${NumberInput(0, () => {}, true)}</td>
      <td></td>
      <td class="is-va-middle">Zero value</td>
    </tr>
  </tbody>
`
