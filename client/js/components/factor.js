const { html } = lighterhtml

export const Desc = (text) => html`
  <div class="field">
    <strong>Q: </strong>${text}
  </div>
`
