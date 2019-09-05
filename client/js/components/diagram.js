import { ArrowDefs, Arrows } from './arrows.js'
const { html } = lighterhtml

//TODO: Make most of the navigation buttons on the site <a> tags to facilitate opening link in new tab and SEO.
const Cell = ({ key, value, title, choice, decision, notify, external, hasExternal, importance, path, onClick }) => {
  let box
  if (!key) {
    box = ''
  } else {
    let classStr = 'button is-block is-flex'
    if (external) classStr += ' is-dashed has-text-grey'
    const badges = []
    if (value) {
      badges.push(html`<i class="badge far fa-heart" />`)
    }
    if (choice) {
      badges.push(html`<i class="badge fas fa-sliders-h" />`)
    }
    if (decision) {
      badges.push(html`<i class="badge fas fa-balance-scale-right" />`)
    }
    if (notify) {
      badges.push(html`
        <span class="status has-text-danger">
          <i class="fas fa-circle" />
        </span>
      `)
    }
    if ((!isNaN(importance)) && (importance > 40)) {
      badges.push(html`<i class='badge badge2 fas fa-exclamation has-text-danger' />`)
      if (importance > 160) {
        badges.push(html`<i class='badge badge3 fas fa-exclamation has-text-danger' />`)
      }
    }
    box = html`
      <a class=${classStr} onclick=${onClick} href=${path} >
        ${badges}
        <span>${title}</span>
      </a>
    `
  }
  return html`<div class='diagram-cell'>${box}</div>`
}

const Row = (row) => html`
  <div class="diagram-row">
    ${row.map(Cell)}
  </div>
`

const DiagramHeader = (title, collapsed, onClick) => {
  const faIcon = 'fa-chevron-' + ((collapsed) ? 'down' : 'right')
  const iconClass = 'icon is-small fas fa-sm ' + faIcon
  return html`
    <h1 class="subtitle is-marginless" >
      <span class="is-cursor-pointer" onclick=${onClick}>
        <i class=${iconClass} />
        <span class="is-va-middle is-uppercase">${title}</span>
      </span>
    </h1>
  `
}

const DiagramBody = (arrows, extArrows, rows) => html`
  <div class="diagram">
    ${Arrows(arrows, extArrows)}
    ${rows.map(Row)}
  </div>
`

const Diagram = ({title, rows, arrows, extArrows, collapsed, toggle }) => html`
    ${DiagramHeader(title, collapsed, toggle)}
  <div class="diagram-cont">
    ${(collapsed) ? '' : DiagramBody(arrows, extArrows, rows) }
  </div>
`

export const Diagrams = (diagrams, onClick) => [ArrowDefs(), ...diagrams.map(g => Diagram(g, onClick))]
