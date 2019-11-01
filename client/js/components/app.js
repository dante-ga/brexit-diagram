const { html } = lighterhtml

const NavBarItem = ({ title, active, href, onClick }) => html`
  <a
    class=${['navbar-item', 'is-flex', 'is-va-center',  'is-tab', (active) ? 'is-active' : ''].join(' ')}
    onclick=${onClick}
    href=${href}
  >
    ${title}
  </a>
`

export const NavBar = ({navTabs, navTabsEnd, showMenu, toggleMenu}) => {
  return html`
    <nav class="navbar has-shadow is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="logo is-hidden-mobile">
          Brexit<i class="fas fa-project-diagram" /><br>Diagram
        </div>
        ${navTabs.map(NavBarItem)}
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onclick=${toggleMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class=${'navbar-menu' + ((showMenu) ? ' is-active' : '') }>
        <div class="navbar-end">
          <a class="navbar-item is-flex is-va-center" href="https://github.com/dante-ga/brexit-diagram" target="_blank">
            <img src="/img/github.png" >
          </a>
          ${navTabsEnd.map(NavBarItem)}
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

export const Survey = () => html`
  <h1 class="title has-text-centered">
    Survey about this website
  </h1>
`
