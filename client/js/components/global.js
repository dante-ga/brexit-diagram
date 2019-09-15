const { html } = lighterhtml

export const Title = (text) => html`
  <h1 class="title has-text-centered">
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

const Tab = ({label, active, onClick, path}) => html`
  <li class=${(active) ? 'is-active' : ''} >
    <a onclick=${onClick} href=${path} >
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

export const Info = ({title, content, onClose}) => html`
  <article class="message is-info">
    <div class="message-header">
      <p>
        <span class="icon">
          <i class="fas fa-info-circle" />
        </span>
        <span>${title}</span>
      </p>
      <button class="delete" aria-label="delete" onclick=${onClose} />
    </div>
    <div class="message-body content">
      ${content}
    </div>
  </article>
`
