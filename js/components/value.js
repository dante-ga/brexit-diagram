import { Sign } from './values.js'
const { html } = lighterhtml

const ValueRow = ({positive, value, title}) => html`
  <tr>
    <td>${Sign((value === 0) ? null : positive, ()=>{}, true)}</td>
    <td>${value}</td>
    <td class="is-va-middle">${title}</td>
  </tr>
`

export const ValueRegionTable = (valueList) => html`
  <table class="table is-fullwidth">
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
