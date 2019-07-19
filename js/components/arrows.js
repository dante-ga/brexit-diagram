const { svg } = lighterhtml

const Arrow = ([[Ai, Aj],[Bi, Bj]]) => {
  let d
  const Ax = Aj * 250 + 210
  let Ay = Ai * 128 + 44
  const Bx = Bj * 250
  let By = Bi * 128 + 44
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
  console.log([Ai, Aj],[Bi, Bj])
  console.log(d)
  return svg`
    <path
      d=${d}
      style="stroke:black; stroke-width: 1.25px; fill: none; marker-end: url(#arrow);"
    />
  `
}

export const Arrows = (arrows) => svg`
  <svg class="grid-bg">
    <defs>
      <marker id="arrow" markerWidth="13" markerHeight="13" refx="9" refy="6" orient="auto">
        <path d="M2,2 L2,11 L10,6 L2,2" style="fill:black;" />
      </marker>
    </defs>
    ${arrows.map(Arrow)}
  </svg>
`
