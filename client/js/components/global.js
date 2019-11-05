import { html } from '../../third_party/lit-html/lit-html.js'

export const Title = (text) => html`
  <h1 class="title has-text-centered">
    ${text}
  </h1>
`

export const Button = ({label, onClick}) => html`
  <button
    class="button is-primary"
    @click=${onClick}
  >
    ${label}
  </button>
`

export const ButtonSection = (button) => html`
  <div class="button-section has-text-centered">
    ${Button(button)}
  </div>
`

const Tab = ({label, active, onClick, path}) => html`
  <li class=${(active) ? 'is-active' : ''} >
    <a @click=${onClick} href=${path} >
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
          <i class="fas fa-info-circle" ></i>
        </span>
        <span>${title}</span>
      </p>
      <button class="delete" aria-label="delete" @click=${onClose} ></button>
    </div>
    <div class="message-body content">
      ${content}
    </div>
  </article>
`

//Designed to be embeded in content strings so no DOM rendering.
export const outLink = (text, href) => `<a href=${href} target="_blank"><span>${text}</span><span class="icon"><i class="fas fa-external-link-alt" ></i></span></a>`
