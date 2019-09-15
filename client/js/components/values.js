import { NumberInput } from './inputs.js'
import { round2tenth } from '../util.js'
const { html } = lighterhtml

export const Sign = (positive) => {
  let iconClass, spanColor
  if (positive === true) {
    iconClass = 'fas fa-plus'
    spanColor = 'has-text-success'
  } else if (positive === false) {
    iconClass = 'fas fa-minus'
    spanColor = 'has-text-danger'
  } else if (positive === null) {
    iconClass = 'far fa-circle'
    spanColor = ''
  }
  const spanClass = 'icon ' + spanColor
  return html`
    <span class=${spanClass}>
      <i class=${iconClass} />
    </span>
  `
}

const SignButton = (positive, toggle) => html`
  <button
    class=${'button ' + ((positive === null) ? 'is-static' : '')}
    onclick=${toggle}
  >
    ${Sign(positive)}
  </button>
`

const ValueRow = ({factor, positive, value, gap, title, toggleSign, onValueChange, onGapChange, refObj}) => html.for(refObj)`
  <tr>
    <td>${SignButton((value === 0) ? null : positive, toggleSign)}</td>
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
  </table>
`

export const ValuesInfo = () => html`
  As a UK voter please indicate how much you value the following factors relative to each other. You can also set individual values from the influence diagram and come back here to fine-tune them before getting the <a href="/decision">decision recommendation</a>. For agents other than the United Kingdom (eg. EU), please provide the values you think that their decision makers have.
`
