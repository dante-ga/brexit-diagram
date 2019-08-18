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

const Tab = ({label, active, onClick}) => html`
  <li class=${(active) ? 'is-active' : ''} >
    <a onclick=${onClick} >
      ${label}
    </a>
  </li>
`

export const Tabs = (tabs) => html`
  <div class="tabs is-boxed">
    <ul>
      ${tabs.map(Tab)}
    </ul>
  </div>
`
