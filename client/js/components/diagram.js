import { ArrowDefs, Arrows } from './arrows.js'
const { html } = lighterhtml

const Cell = ({ key, value, shiftBack, title, choice, decision, notify, external, hasExternal, importance, path, onClick }) => {
  let cellClass = 'diagram-cell'
  let box
  if (!key) {
    box = ''
  } else {
    let classStr = 'button is-block is-flex'
    if (external) classStr += ' is-dashed has-text-grey'
    const badges = []
    if (value) {
      title = html`
      <span class="icon is-medium">
        <i class="far fa-lg fa-heart" />
      </span>
      `
      cellClass += ' value-cell'
      if (shiftBack) {
        cellClass += ' shift-back'
      }
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
  return html`<div class=${cellClass} >${box}</div>`
}

const Row = (row) => html`
  <div class="diagram-row">
    ${row.map(Cell)}
  </div>
`

export const Diagram = ({ rows, arrows, valuePaths, extArrows }) => html`
  ${ArrowDefs()}
  <div class="diagram-cont">
    <div class="diagram">
      ${Arrows(arrows, valuePaths, extArrows)}
      ${rows.map(Row)}
    </div>
  </div>
`
