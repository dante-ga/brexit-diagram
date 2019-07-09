const { html } = lighterhtml

export const Button = ({label, onClick}) => html`
  <button
    class="button is-primary"
    onclick=${onClick}
  >
    ${label}
  </button>
`
