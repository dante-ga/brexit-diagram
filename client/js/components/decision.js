const { html } = lighterhtml

export const Progress = (val, max) => html`
  <div class="navbar-item is-expanded is-flex is-va-center">
    <progress class="progress is-primary is-medium" value=${val+''} max=${max} />
  </div>
`

export const Next = (onClick, path) => html`
  <div class="navbar-item is-va-center">
    <a
      class="${'button ' + ((onClick) ? 'is-primary' : 'is-static' )}"
      onclick=${onClick}
      href=${path}
      title="Go to the next unanswered question"
    >
      <span>Next Question</span>
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
    Recommended option: <strong>${alternatives[bestOption].label}</strong>
  `
}
