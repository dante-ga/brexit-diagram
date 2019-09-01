import { Sign } from './values.js'
const { html } = lighterhtml

const ValueRow = ({positive, value, title, highlight}) => html`
  <tr class=${(highlight) ? 'has-text-weight-bold' : ''}>
    <td>${Sign((value === 0) ? null : positive, ()=>{}, true)}</td>
    <td>${value}</td>
    <td>${title}</td>
  </tr>
`

export const ValueRegionTable = (valueList) => html`
  <table class="table">
    <thead>
      <tr>
        <th>Sign</th>
        <th>Value</th>
        <th>Factor</th>
      </tr>
    </thead>
    <tbody>
      ${valueList.reverse().map(ValueRow)}
    </tbody>
  </table>
`
