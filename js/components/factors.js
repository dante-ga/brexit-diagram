const { html } = lighterhtml

export const Title = (text, tag) => html`
  <h1 class="subtitle">
    <span class="is-pulled-right">
      &nbsp;
      ${Tag(tag.text, tag.color)}
    </span>
    ${text}
  </h1>
`

export const Desc = (text) => html`
  <div class="field">
    ${text}
  </div>
`

const Tag = (label, color='') => html`
  <span class=${['tag', 'is-medium', color].join(' ')}>
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

export const Factor = (content) => html`
  <div class="box">
    ${content}
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
