import { Arrows } from './arrows.js'
const { html } = lighterhtml

const Cell = ({ key, value, title, external, hasExternal }) => {
  let box
  if (!key) {
    box = ''
  } else {
    let classStr = 'button is-block is-flex'
    if (external) classStr += ' is-dashed has-text-grey'
    box = html`
      <a class=${classStr}>
        <span>${title}</span>
      </a>
    `
  }
  return html`<div class='grid-cell'>${box}</div>`
}

const Row = (row) => html`
  <div class="grid-row">
    ${row.map(Cell)}
  </div>
`

const Grid = ({subKey, rows, arrows, extArrows }) => html`
  <h1 class="subtitle is-uppercase">${subKey}</h1>
  <div class="grid">
    ${Arrows(arrows, extArrows)}
    ${rows.map(Row)}
  </div>
`

export const Grids = (grids) => grids.map(Grid)
