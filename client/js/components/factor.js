const { html } = lighterhtml

export const Question = (text) => html`
  <div class="field">
    <strong>Q: </strong>${text}
  </div>
`

export const Desc = (text) => html`
  <div class="field content">
    ${html([text])}
  </div>
`

export const CalcDesc = (text) => html`
  <article class="message">
    <div class="message-header">
      <p>
        <span class="icon">
          <i class="fas fa-calculator" />
        </span>
        <span>How is this calculated?</span>
      </p>
    </div>
    <div class="message-body content">
      ${html([text])}
    </div>
  </article>
`
