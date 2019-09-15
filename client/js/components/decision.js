const { html } = lighterhtml

export const Progress = (val, max) => html`
  <div class="navbar-item is-expanded is-flex is-va-center">
    <progress class="progress is-primary is-medium" value=${val+''} max=${max} />
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
      onclick=${onClick}
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
    <a class="button is-success has-text-weight-bold" onclick=${onClick} href=${path} >
      Get Decision!
    </a>
  </div>
`

export const ProgressPage = ( count, totalCount ) => html`
  <div class="notification">
    Your decision recommendation will appear here once you answer all of the questions.
    <br>Questions answered: <strong>${count} / ${totalCount}</strong>
  </div>
`

const Alternative = ({ totalValue, label }) => html`
  <tr>
    <td>${label}</td>
    <td><strong>${Math.round(totalValue)}</strong></td>
  </tr>
`

export const Decision = (decision) => {
  const { bestOption, alternatives } = decision
  return html`
    <table class="table">
      <thead>
        <tr>
          <th>Option</th>
          <th>Your expected total value</th>
        </tr>
      </thead>
      <tbody>
        ${Object.values(alternatives).map(Alternative)}
      </tbody>
    </table>
    <div class="field">
      Recommended option: <strong>${alternatives[bestOption].label}</strong>
    </div>
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
