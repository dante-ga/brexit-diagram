const { html } = lighterhtml

export const Progress = (val, max) => html`
  <div class="navbar-item is-expanded is-flex is-va-center">
    <progress class="progress is-primary is-medium" value=${val+''} max=${max} />
  </div>
`

export const Next = (onClick) => html`
  <div class="navbar-item is-va-center">
    <button
      class="${'button ' + ((onClick) ? 'is-primary' : 'is-static' )}"
      onclick=${onClick}
      title="Go to the next unanswered question"
    >
      <span>Next Question</span>
      <span class="icon is-small">
        <i class="fas fa-arrow-right"></i>
      </span>
    </button>
  </div>
`

const Completion = ({ complete, count, totalCount }) => html`
  <h1>Answers filled in: ${count} / ${totalCount} </h1>
  <h1>Complete: ${(complete) ? 'yes' : 'no'}</h1>
`

const Alternative = ([option, { totalValue }]) => html`
  <span>${option}: ${Math.round(totalValue)};&nbsp;</span>
`

const Decision = (decision) => {
  if (decision === null) {
    return html`
      <h1>Best option: ?</h1>
    `
  } else {
    const {bestOption, maxTotalValue, alternatives} = decision
    return html`
      <h1>Option values: ${Object.entries(alternatives).map(Alternative)}</a>
      <h1>Best option: ${bestOption}</h1>
    `
  }
}

export const Results = ({completion, decision}) => html`
  <div>
    ${Completion(completion)}
    ${Decision(decision)}
  </div>
`
