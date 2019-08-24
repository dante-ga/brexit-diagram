const { html } = lighterhtml

export const Progress = (val, max) => html`
  <div class="navbar-item is-expanded is-flex is-va-center">
    <progress class="progress is-primary" value=${val+''} max=${max} />
  </div>
`

const Completion = ({ complete, count, totalCount }) => html`
  <h1>Answers filled in: ${count} / ${totalCount} </h1>
  <h1>Complete: ${(complete) ? 'yes' : 'no'}</h1>
`

const Decision = (decision) => {
  if (decision === null) {
    return html`
      <h1>Best option: ?</h1>
    `
  } else {
    const {bestOption, maxTotalValue, alternatives} = decision
    return html`
      <h1>Best option: ${bestOption}</h1>
      ${JSON.stringify({alternatives})}
    `
  }
}

export const Results = ({completion, decision}) => html`
  <div>
    ${Completion(completion)}
    ${Decision(decision)}
  </div>
`
