const { html } = lighterhtml

export const Desc = (text) => html`
  <div class="field">
    ${text}
  </div>
`
