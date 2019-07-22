import { ArrowDefs, Arrows } from './arrows.js'
const { html } = lighterhtml

const Cell = ({ key, value, title, external, hasExternal }, onClick) => {
  let box
  if (!key) {
    box = ''
  } else {
    let classStr = 'button is-block is-flex'
    if (external) classStr += ' is-dashed has-text-grey'
    box = html`
      <button class=${classStr} onclick=${() => onClick(key)} >
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

const Grid = ({subKey, rows, arrows, extArrows }, onClick) => html`
  <h1 class="subtitle is-uppercase">${subKey}</h1>
  <div class="grid">
    ${Arrows(arrows, extArrows)}
    ${rows.map(r => Row(r, onClick))}
  </div>
`

export const Grids = (grids, onClick) => [ArrowDefs(), ...grids.map(g => Grid(g, onClick))]
