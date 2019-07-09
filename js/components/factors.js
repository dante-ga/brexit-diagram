const { html } = lighterhtml
import { round2tenth, camel2space } from '../util.js'

export const Title = (text, calcVal, type) => html`
  <h1 class="subtitle">
    <span class="is-pulled-right">
      &nbsp;
      ${FactorValue(calcVal, type)}
    </span>
    ${text}
  </h1>
`

const value2text = {
  option: v => camel2space(v),
  boolean: v => (v) ? 'YES' : 'NO',
  range: v => round2tenth(v * 100),
  probability: v => round2tenth(v * 100) + '%',
  change: v => ((v > 0) ? '+' : '') + Math.round(v * 100) + '%',
  value: v => round2tenth(v),
  ratio: v => v,
}

const positivityColor = v => (v === 0) ? 'is-dark' : ((v > 0) ? 'is-success' : 'is-danger')

const value2color = {
  option: () => 'is-dark',
  boolean: v => (v) ? 'is-success' : 'is-danger',
  range: () => 'is-dark',
  probability: () => 'is-dark',
  ratio: positivityColor,
  change: positivityColor,
  value: positivityColor,
}

export const FactorValue = (value, type) => {
  const text = value2text[type](value)
  const color = value2color[type](value)
  const classes = ['tag', 'is-medium', color].join(' ')
  return html`
    <span class=${classes}>
      ${text}
    </span>
  `
}

export const Desc = (text) => html`
  <div class="field">
    ${text}
  </div>
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
