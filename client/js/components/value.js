import { Sign } from './values.js'
import { html } from '../../third_party/lit-html/lit-html.js'

const ValueRow = ({positive, value, title, highlight}) => html`
  <tr class=${(highlight) ? 'has-text-weight-bold' : ''}>
    <td>${Sign((value === 0) ? null : positive, ()=>{}, true)}</td>
    <td>${value}</td>
    <td>${title}</td>
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

export const ValueInfo = () => html`
  As a UK voter please indicate how much you value this factor by setting a positive or a negative value on the slider below. The table above the slider shows other factors with similar absolute values for comparison. You can fine-tune all of the values in the "<a href="/values/UK">Values</a>" tab. For agents other than the United Kingdom, please provide the values you think that their decision makers have. Some factors are valued by agents other than the United Kingdom (e.g. EU). In those cases please provide the values which you think those agents have.
`
