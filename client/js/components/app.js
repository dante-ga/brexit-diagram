const { html } = lighterhtml

const NavBarItem = ({ title, active, href, onClick }) => html`
  <a
    class=${['navbar-item', 'is-tab', (active) ? 'is-active' : ''].join(' ')}
    onclick=${onClick}
    href=${href}
  >
    ${title}
  </a>
`

export const NavBar = ({goHome, navTabs}) => {
  return html`
    <nav class="navbar has-shadow is-fixed-top is-flex" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="/img/logo.png" width="28" height="28" >
        </a>
        ${navTabs.map(NavBarItem)}
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
