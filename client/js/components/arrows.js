const { svg } = lighterhtml

//TODO: Don't let arrows go under intermediate nodes

const cellHeight = 92
const nodeHeight = 62
const cellWidth = 210
const nodeWidth = 170
const arrowSpace = 18
const padWidth = cellWidth - nodeWidth
const padHeight = cellHeight - nodeHeight

const Arrow = ([[Ai, Aj],[Bi, Bj]], valuePath) => {
  let d
  const Ax = Aj * cellWidth + nodeWidth
  let Ay = Ai * cellHeight + nodeHeight/2
  const Bx = Bj * cellWidth
  let By = Bi * cellHeight + nodeHeight/2
  if (Ai === Bi) {
    d = `M${Ax},${Ay} L${Bx - 1},${By}`
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
    d = `M${Ax},${Ay} L${E1x},${E1y} L${E2x},${E2y} L${Bx - 1},${By}`
  }
  const pathClass = (valuePath) ? 'value-path' : 'arrow-path'
  return svg`<path d=${d} class=${pathClass} />`
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
    d = `M${x},${y1} L${x2},${y1} L${x2},${y2} L${x3 - 1},${y2}`
  } else {
    const x2 = x + padWidth
    d = `M${x},${y} L${x2 - 1},${y}`
  }
  return svg`<path d=${d} class="ext-arrow-path" />`
}

export const Arrows = (arrows, valuePaths, extArrows) => svg`
  <svg class="diagram-bg">
    <defs>
      <marker
        id="arrow" orient="auto"
        markerWidth="13" markerHeight="13"
        refx="7" refy="5"
      >
        <path d="M2,2 L2,9 L8,5 L2,2" />
      </marker>
      <marker
        id="hollowArrow" orient="auto"
        markerWidth="13" markerHeight="13"
        refx="7" refy="5"
      >
        <path d="M2,8 L7,5 L2,2" />
      </marker>
    </defs>
    ${arrows.map(a => Arrow(a, false))}
    ${valuePaths.map(vp => Arrow(vp, true))}
    ${extArrows.map(ExtArrow)}
  </svg>
`
