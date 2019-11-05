import { html } from '../../third_party/lit-html/lit-html.js'

export const Progress = (val, max) => html`
  <div class="navbar-item is-expanded is-flex is-va-center">
    <progress class="progress is-primary is-medium" .value=${val+''} max=${max} ></progress>
  </div>
`

export const Next = (onClick, path) => html`
  <div class="navbar-item is-va-center">
    <span
      class="icon is-medium tooltip is-tooltip-primary is-tooltip-multiline"
      data-tooltip='Please answer all of the questions to submit your response and get a decision recommendation. You can answer the questions in any order by using the influence diagram or by using the "Next&nbsp;question" button.'
    >
      <i class="fas fa-lg fa-info-circle"></i>
    </span>
  </div>
  <div class="navbar-item is-va-center">
    <a
      class="${'button ' + ((onClick) ? 'is-primary' : 'is-static' )}"
      @click=${onClick}
      href=${path}
    >
      <span>Next question</span>
      <span class="icon is-small">
        <i class="fas fa-arrow-right"></i>
      </span>
    </a>
  </div>
`

export const Finish = (onClick, path) => html`
  <div class="navbar-item is-va-center">
    <a class="button is-success has-text-weight-bold" @click=${onClick} href=${path} >
      Decide!
    </a>
  </div>
`

export const ProgressPage = ( count, totalCount ) => html`
  <div class="notification">
    Your decision recommendation will appear here once you answer all of the questions.
    <br>Questions answered: <strong>${count} / ${totalCount}</strong>
  </div>
`

const TableHeader = (text) => html`
  <th>${text}</th>
`

const TableCell = (text) => html`
  <td>${text}</td>
`

const TableRow = (cells) => html`
  <tr>
    ${cells.map(TableCell)}
  </tr>
`

export const Decision = ({decision, valueRows, optionLabels, totalValues}) => {
  const { bestOption, alternatives } = decision
  return html`
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th rowspan="2" style="vertical-align: middle;">
            Factors valued by the UK
          </th>
          <th colspan=${optionLabels.length} align="center">
            Expected values by option
          </th>
        </tr>
        <tr>
          ${optionLabels.map(TableHeader)}
        </tr>
      </thead>
      <tbody>
        ${valueRows.map(TableRow)}
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          ${optionLabels.map(TableHeader)}
        </tr>
        <tr>
          <th>Total expected value</th>
          ${totalValues.map(TableHeader)}
        <tr>
      </tfoot>
    </table>

    <h1 class="subtitle is-2 has-text-centered recommendation">
      Recommended option: <strong>${alternatives[bestOption].label}</strong>
    </h1>
  `
}

export const DecisionInfo = () => html`
  The decision recommendation is made in the following way:
  <ol>
    <li>Each of the Brexit options is considered separately.</li>
    <li>Consequences of the decision are calculated based on the various relations between the factors and answers that you gave.</li>
    <li>Outcomes are evaluated based on the values that you provided.</li>
    <li>Total expected values of the Brexit options are compared to find the best one.</li>
  </ol>
  <strong>Note</strong>: the recommendation updates automatically when you change your answers.
`
