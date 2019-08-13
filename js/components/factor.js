const { html } = lighterhtml

export const Title = (text) => html`
  <h1 class="subtitle">
    <span class="is-pulled-right">
      &nbsp;
    </span>
    ${text}
  </h1>
`

export const Desc = (text) => html`
  <div class="field">
    ${text}
  </div>
`
