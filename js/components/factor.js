const { html } = lighterhtml

export const Title = (text, tag) => html`
  <h1 class="subtitle">
    <span class="is-pulled-right">
      &nbsp;
      ${Tag(tag.text, tag.color)}
    </span>
    ${text}
  </h1>
`

export const Desc = (text) => html`
  <div class="field">
    ${text}
  </div>
`

const Tag = (label, color='') => html`
  <span class=${['tag', 'is-medium', color].join(' ')}>
    ${label}
  </span>
`
