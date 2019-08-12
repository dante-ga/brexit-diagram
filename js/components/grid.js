import { ArrowDefs, Arrows } from './arrows.js'
const { html } = lighterhtml

const Cell = ({ key, value, title, choice, decision, external, hasExternal }, onClick) => {
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
    const notify = value || choice
    if (notify) {
      badges.push(html`
        <span class="status has-text-danger">
          <i class="fas fa-circle" />
        </span>
      `)
    }
    box = html`
      <button class=${classStr} onclick=${() => onClick(key)} >
        ${badges}
        <span>${title}</span>
      </button>
    `
  }
  return html`<div class='grid-cell'>${box}</div>`
}

const Row = (row, onClick) => html`
  <div class="grid-row">
    ${row.map(c => Cell(c, onClick))}
  </div>
`

const GridHeader = (title, collapsed, onClick) => {
  const faIcon = 'fa-chevron-' + ((collapsed) ? 'down' : 'right')
  const iconClass = 'icon is-small fas fa-sm ' + faIcon
  return html`
    <h1 class="subtitle" >
      <span class="is-cursor-pointer" onclick=${onClick}>
        <i class=${iconClass} />
        <span class="is-va-middle is-uppercase">${title}</span>
      </span>
    </h1>
  `
}

const GridBody = (arrows, extArrows, rows, onClick) => html`
  <div class="grid">
    ${Arrows(arrows, extArrows)}
    ${rows.map(r => Row(r, onClick))}
  </div>
`

const Grid = ({subKey, rows, arrows, extArrows, collapsed, toggle }, onClick) => html`
  ${GridHeader(subKey, collapsed, toggle)}
  ${(collapsed) ? '' : GridBody(arrows, extArrows, rows, onClick) }
`

export const Grids = (grids, onClick) => [ArrowDefs(), ...grids.map(g => Grid(g, onClick))]
