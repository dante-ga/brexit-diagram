const { html } = lighterhtml

export const Decision = ({bestOption, maxTotalValue, alternatives}) => html`
  <h1>Best option: ${bestOption}</h1>
  ${JSON.stringify({alternatives})}
`
