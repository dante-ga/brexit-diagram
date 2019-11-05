import { html } from '../../third_party/lit-html/lit-html.js'
import { unsafeHTML } from '../../third_party/lit-html/directives/unsafe-html.js'

export const Question = (text) => html`
  <div class="field content is-medium">
    <strong>Q: </strong>${text}
  </div>
`

export const Desc = (text) => html`
  <div class="field content">
    ${unsafeHTML(text)}
  </div>
`

export const CalcDesc = (text) => html`
  <article class="message">
    <div class="message-header">
      <p>
        <span class="icon">
          <i class="fas fa-calculator" ></i>
        </span>
        <span>How is this calculated?</span>
      </p>
    </div>
    <div class="message-body content">
      ${unsafeHTML(text)}
    </div>
  </article>
`
