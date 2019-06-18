const { html } = lighterhtml

const NavBarItem = (screen, active, onNav) => html`
  <a
    class=${[
      'navbar-item',
      'is-tab',
      'is-capitalized',
      (active) ? 'is-active' : ''
    ].join(' ')}
    onClick=${() => onNav(screen)}
  >
    ${screen}
  </a>
`

export const NavBar = ({activeScreen, screens, onNav}) => {
  return html`
    <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item">
          <img src="/img/logo.png" width="28" height="28">
        </a>
        ${screens.map((screen) =>
          NavBarItem(screen, (screen === activeScreen), onNav)
        )}
      </div>
    </nav>
  `
}

export const App = (nav, content) => html`
  ${nav}
  <section class="section">
    ${content}
  </section>
`
