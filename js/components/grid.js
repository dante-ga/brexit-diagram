import { Arrows } from './arrows.js'
const { html } = lighterhtml

const Cell = ({ key, value, title }) => {
  let box
  if (!key) {
    box = ''
  } else {
    box = html`<div class="box">${title}</div>`
  }
  return html`<div class='grid-cell'>${box}</div>`
}

const Row = (row) => html`
  <div class="grid-row">
    ${row.map(Cell)}
  </div>
`

const Grid = ({subKey, rows, arrows }) => html`
  <h1 class="subtitle is-uppercase">${subKey}</h1>
  <div class="grid">
    ${Arrows(arrows)}
    ${rows.map(Row)}
  </div>
`

export const Grids = (grids) => grids.map(Grid)
