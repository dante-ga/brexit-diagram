const { html } = lighterhtml

export const Progress = (val, max) => html`
  <div class="navbar-item is-expanded is-flex is-va-center">
    <progress class="progress is-primary" value=${val} max=${max} />
  </div>
`

export const Decision = ({bestOption, maxTotalValue, alternatives}) => html`
  <h1>Best option: ${bestOption}</h1>
  ${JSON.stringify({alternatives})}
`
