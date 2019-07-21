const { svg } = lighterhtml

const h = 102
const ho = 31

const Arrow = ([[Ai, Aj],[Bi, Bj]]) => {
  let d
  const Ax = Aj * 250 + 210
  let Ay = Ai * h + ho
  const Bx = Bj * 250
  let By = Bi * h + ho
  if (Ai === Bi) {
    d = `M${Ax},${Ay} L${Bx},${By}`
  } else {
    //Shift endpoint to avoid overlap
    if (Ai > Bi) {
      By += 15
      Ay -= 15
    } else {
      By -= 15
      Ay += 15
    }

    //Add elbows to the connector
    const E1x = Ax + 20
    const E1y = Ay
    const E2x = E1x
    const E2y = By
    d = `M${Ax},${Ay} L${E1x},${E1y} L${E2x},${E2y} L${Bx},${By}`
  }
  return svg`
    <path
      d=${d}
      style="stroke:#dbdbdb; stroke-width: 2px; fill: none; marker-end: url(#arrow);"
    />
  `
}

const ExtArrow = ({loc, blocked, flip}) => {
  let d
  const [i, j] = loc
  const x = j * 250 + 210
  const y = i * h + ho
  if (blocked) {
    const y1 = y + ((flip) ? -15 : 15)
    const y2 = y + ((flip) ? -50 : 50)
    d = `M${x},${y1} L${x + 20},${y1} L${x + 20},${y2} L${x + 40},${y2}`
  } else {
    d = `M${x},${y} L${x + 40},${y}`
  }
  return svg`
    <path
      d=${d}
      style="stroke:#dbdbdb; stroke-width: 2px; fill: none; marker-end: url(#hollowArrow); stroke-dasharray: 6px;"
    />
  `
}

export const Arrows = (arrows, extArrows) => svg`
  <svg class="grid-bg">
    <defs>
      <marker id="arrow" markerWidth="13" markerHeight="13" refx="7" refy="5" orient="auto">
        <path d="M2,2 L2,9 L8,5 L2,2" style="fill:#dbdbdb;" />
      </marker>
    </defs>
    <defs>
      <marker id="hollowArrow" markerWidth="13" markerHeight="13" refx="7" refy="5" orient="auto">
        <path d="M2,2 L2,9 L8,5 L2,2" style="stroke:#dbdbdb; stroke-width: 1px; fill: white;" />
      </marker>
    </defs>
    ${arrows.map(Arrow)}
    ${extArrows.map(ExtArrow)}
  </svg>
`
