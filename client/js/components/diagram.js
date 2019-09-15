import { Arrows } from './arrows.js'
const { html } = lighterhtml

const Cell = ({ key, value, shiftBack, title, choice, decision, negotiation, notify, external, hasExternal, importance, path, onClick }) => {
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
      badges.push(html`
        <span class="badge tooltip is-tooltip-left" data-tooltip="settable numeric values">
          <i class="fas fa-sliders-h" />
        </span>
      `)
    }
    if (decision) {
      badges.push(html`
        <span class="badge tooltip is-tooltip-left" data-tooltip="decision">
          <i class="fas fa-balance-scale-right" />
        </span>
      `)
    }
    if (negotiation) {
      badges.push(html`
        <span class="badge tooltip is-tooltip-left" data-tooltip="negotiation">
          <i class="fas fa-users" />
        </span>
      `)
    }
    if (notify) {
      badges.push(html`
        <span
          class="status has-text-danger tooltip is-tooltip-left is-tooltip-danger"
          data-tooltip="unanswered question"
        >
          <i class="fas fa-circle" />
        </span>
      `)
    }

    if ((!isNaN(importance)) && (importance > 40)) {
      if (importance < 160) {
        badges.push(html`
          <span
            class="badge badge2 has-text-danger tooltip is-tooltip-danger is-tooltip-left"
            data-tooltip="significant disagreement"
          >
            <i class="fas fa-exclamation" />
          </span>
        `)
      } else {
        badges.push(html`
          <span
            class="badge badge2 has-text-danger tooltip is-tooltip-danger is-tooltip-left"
            data-tooltip="critical disagreement"
          >
            <i class="fas fa-exclamation" /><i class="fas fa-exclamation" />
          </span>
        `)
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
  <br>
`

export const Diagram = ({ rows, arrows, valuePaths, extArrows }) => html`
  <div class="diagram-cont">
    <div class="diagram">
      ${Arrows(arrows, valuePaths, extArrows)}
      ${rows.map(Row)}
    </div>
  </div>
`

export const DiagramInfo = () => html`
  The influence diagram shows how decisions influence objective factors which in turn affect subjective values. Tabs below contain separate parts of the diagram. It has the following types of elemets:
  <br><strong>Box</strong> - a factor of a certain type which usually contains settable numeric values, stistics and arguments.
  <br><strong>Heart</strong> - a settable subjective value of a factor which also contains statistics and arguments.
  <br><strong>Arrow</strong> - causal connection between numeric values of the two factors.
  <br><strong>Dashed arrow</strong> - there is one or more target factor in the following parts of the diagram.
  <br><strong>Dashed box</strong> - the factor belongs to one of the previous parts of the diagram.
`
