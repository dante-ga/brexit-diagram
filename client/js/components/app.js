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

export const ToggleMode = (evaluating, onClick) => {
  const text = (evaluating) ? 'View Stats' : 'Edit Answers'
  const color = (evaluating) ? 'info' : 'success'
  const icon = (evaluating) ? 'fas fa-eye' : 'far fa-edit'
  const buttonClass = 'button is-' + color
  return html`
    <div class="navbar-item is-va-center">
      <button class=${buttonClass} onclick=${onClick}>
        <span class="icon is-medium">
          <i class=${icon} />
        </span>
        <span>${text}</span>
      </button>
    </div>
  `
}

export const NavBar = ({goHome, navTabs, toggleMode}) => {
  return html`
    <nav class="navbar has-shadow is-fixed-top is-flex" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/" onClick=${goHome}>
          <img src="/img/logo.png" width="28" height="28" >
        </a>
        ${navTabs.map(NavBarItem)}
        ${toggleMode}
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

export const Home = () => html`
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Welcome to Gitarg!
        </h1>
        <h2 class="subtitle">
          Gitarg will help you evaluate Brexit options and see why different people come to different conclusions about it.
        </h2>
      </div>
    </div>
  </section>
`
