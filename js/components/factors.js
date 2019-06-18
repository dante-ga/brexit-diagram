const { html } = lighterhtml

export const Title = (label, value, scale) => html`
  <h1 class="subtitle">
    <span class="is-pulled-right">
      &nbsp;
      ${FactorValue(value, scale)}
    </span>
    ${label}
  </h1>
`

export const FactorValue = (value, scale) => {
  let text, color
  if (value === true) {
    text = 'YES'
    color = 'is-success'
  } else if (value === false) {
    text = 'NO'
    color = 'is-danger'
  } else {
    text = value
    if (typeof value === 'number') {
      if (scale) {
        color = 'is-dark'
      } else if (value > 0) {
        color = 'is-success'
      } else if (value < 0) {
        color = 'is-danger'
      } else {
        color = 'is-dark'
      }
    } else {
      color= 'is-dark'
    }
  }
  const classes = ['tag', 'is-medium', color].join(' ')
  return html`
    <span class=${classes}>
      ${text}
    </span>
  `
}

//TODO: restyle when factor will contain other sections
export const Func = (text) => html`
  <div>${text}</div>
`

const Tag = (label) => html`
  <span class="tag is-medium">
    ${label}
  </span>
`

export const Star = (starred, toggle) => {
  const iconColor = (starred) ? 'has-text-warning' : 'has-text-grey-light'
  const anchorClass = 'icon ' + iconColor
  const iconType = (starred) ? 'fas' : 'far'
  const iconClass = iconType + ' fa-lg fa-star'
  return html`
    <a class=${anchorClass} onclick=${toggle} >
      <i class=${iconClass}></i>
    </a>
  `
}

export const Grouping = (tags, starred, toggleStar) => html`
  <div class="is-flex is-space-between" style="margin-bottom: -0.5rem;">
    <div class="tags is-marginless">
      ${tags.map(Tag)}
      &nbsp;
    </div>
    ${Star(starred, toggleStar)}
  </div>
`

export const Factor = ({content, star}) => html`
  <div class="box">
    ${content}
    ${star}
  </div>
`

export const Factors = (factors) => {

  const numCols = Math.max(1, Math.floor(window.innerWidth / 360))
  const factorCols = Array.from({length: numCols}, () => [])
  factors.forEach((factor, i) => {
    factorCols[i % numCols].push(factor)
  })

  const columns = factorCols.map((factorCol) => html`
    <div class="column">
      ${factorCol.map(Factor)}
    </div>
  `)

  return html`
    <div class="columns is-mobile">
      ${columns}
    </div>
  `
}
