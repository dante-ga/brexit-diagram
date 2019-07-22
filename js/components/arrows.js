const { svg } = lighterhtml

const cellHeight = 92
const nodeHeight = 62
const cellWidth = 250
const nodeWidth = 210
const arrowSpace = 18
const padWidth = cellWidth - nodeWidth
const padHeight = cellHeight - nodeHeight

const Arrow = ([[Ai, Aj],[Bi, Bj]]) => {
  let d
  const Ax = Aj * cellWidth + nodeWidth
  let Ay = Ai * cellHeight + nodeHeight/2
  const Bx = Bj * cellWidth
  let By = Bi * cellHeight + nodeHeight/2
  if (Ai === Bi) {
    d = `M${Ax},${Ay} L${Bx},${By}`
  } else {
    //Shift endpoint to avoid overlap
    if (Ai > Bi) {
      By += arrowSpace
      Ay -= arrowSpace
    } else {
      By -= arrowSpace
      Ay += arrowSpace
    }

    //Add elbows to the connector
    const E1x = Ax + padWidth/2
    const E1y = Ay
    const E2x = E1x
    const E2y = By
    d = `M${Ax},${Ay} L${E1x},${E1y} L${E2x},${E2y} L${Bx},${By}`
  }
  return svg`<path d=${d} class="arrow-path" />`
}

const blockedHeight = padHeight/2 + nodeHeight/2

const ExtArrow = ({loc, blocked, flip}) => {
  let d
  const [i, j] = loc
  const x = j * cellWidth + nodeWidth
  const y = i * cellHeight + nodeHeight/2
  if (blocked) {
    const dir = (flip) ? -1 : 1
    const y1 = y + arrowSpace * dir
    const y2 = y + blockedHeight * dir
    const x2 = x + padWidth/2
    const x3 = x + padWidth
    d = `M${x},${y1} L${x2},${y1} L${x2},${y2} L${x3},${y2}`
  } else {
    const x2 = x + padWidth
    d = `M${x},${y} L${x2},${y}`
  }
  return svg`<path d=${d} class="ext-arrow-path" />`
}

const ArrowMarker = (id) => svg`
  <marker
    id=${id} orient="auto"
    markerWidth="13" markerHeight="13"
    refx="7" refy="5"
  >
    <path d="M2,2 L2,9 L8,5 L2,2" />
  </marker>
`

export const ArrowDefs = () => svg`
  <svg width="0" height="0" class="is-pulled-left">
    <defs>
      ${ArrowMarker('arrow')}
      ${ArrowMarker('hollowArrow')}
    </defs>
  </svg>
`

export const Arrows = (arrows, extArrows) => svg`
  <svg class="grid-bg">
    ${arrows.map(Arrow)}
    ${extArrows.map(ExtArrow)}
  </svg>
`
