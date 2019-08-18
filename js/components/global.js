const { html } = lighterhtml

export const Title = (text) => html`
  <h1 class="subtitle">
    ${text}
  </h1>
`

export const Button = ({label, onClick}) => html`
  <button
    class="button is-primary"
    onclick=${onClick}
  >
    ${label}
  </button>
`
