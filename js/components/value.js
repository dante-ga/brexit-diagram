const { html } = lighterhtml

export const Value = ({ title, valuedBy }) => html`
  <h1 class="subtitle">
    ${title}
  </h1>
  Valued by: ${valuedBy.join(', ')}
`
