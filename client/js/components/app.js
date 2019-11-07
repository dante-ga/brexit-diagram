import { html } from '../../third_party/lit-html/lit-html.js'

const SurveyIcon = () => html`
  <span class="icon is-medium has-text-primary surveyIcon">
    <i class="fas fa-comment-alt" ></i>
  </span>
`

const NavBarItem = ({ title, active, href, onClick }) => html`
  <a
    class=${['navbar-item', 'is-flex', 'is-va-center',  'is-tab', (active) ? 'is-active' : ''].join(' ')}
    @click=${onClick}
    href=${href}
  >
    ${title}
    ${(href === '/survey') ? SurveyIcon() : ''}
  </a>
`

export const NavBar = ({navTabs, navTabsEnd, showMenu, toggleMenu, onLogo}) => {
  return html`
    <nav class="navbar has-shadow is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a href="/diagram/brexit" class="logo is-hidden-mobile" @click=${onLogo}>
          Brexit<i class="fas fa-project-diagram" ></i><br>Diagram
        </a>
        ${navTabs.map(NavBarItem)}
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" @click=${toggleMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class=${'navbar-menu' + ((showMenu) ? ' is-active' : '') }>
        <div class="navbar-end">
          ${navTabsEnd.map(NavBarItem)}
          <a class="navbar-item is-flex is-va-center" href="https://github.com/dante-ga/brexit-diagram" target="_blank">
            <img src="/img/github.png" >
          </a>
        </div>
      </div>
    </nav>
  `
}

const BottomBar = (toolbar) => html`
  <nav class="navbar is-fixed-bottom has-shadow is-flex" role="navigation" >
    ${toolbar}
  </nav>
`

export const App = (nav, content, toolbar) => html`
  ${nav}
  <section class="section">
    ${content}
  </section>
  ${(toolbar) ? BottomBar(toolbar) : ''}
`

export const NotFound = () => html`
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Error 404
        </h1>
        <h2 class="subtitle">
          Sorry, this page was not found.
        </h2>
      </div>
    </div>
  </section>
`
