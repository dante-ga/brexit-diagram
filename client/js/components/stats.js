import { Ruler } from '../components/inputs.js'

const { html, svg } = lighterhtml

const width = 1050
const countHeight = 30

const optionColors = {
  remain: 'red',
  deal: 'orange',
  noDeal: 'dodgerblue',
}

const Layer = ({option, bins, height}) => {
  const color = optionColors[option]
  const h = height + 1
  const commands = ['M 0 ' + h]
  for (const bin of bins) {
    commands.push('V ' + (h - bin * countHeight))
    commands.push('h ' + (width / bins.length))
  }
  commands.push('V ' + h)
  commands.push('H 0')
  let d = commands.join(' ')
  return svg`<path d=${d} stroke=${color} fill=${color} fill-opacity="0.2" />`
}

const HistogramSvg = (options, height) => svg`
  <svg
    width="100%"
    height=${height}
    class="histogram"
    viewBox=${'0 0 ' + width + ' ' + height}
    preserveAspectRatio="none"
  >
    ${Object.entries(options).map(([option, bins]) => Layer({option, bins, height}))}
  </svg>
`

export const Histogram = (options, type, label, showLegend) => {
  let maxCount = 0
  for (const option in options) {
    maxCount = Math.max(maxCount, ...options[option])
  }
  const height = maxCount * countHeight
  return html`
    <div class="histogram-cont field">
      <div class="is-flex is-space-between field">
        <div>${label}</div>
        ${(showLegend) ? Legend() : ''}
      </div>
      ${HistogramSvg(options, height)}
      ${Ruler(type)}
    </div>
  `
}

const OptionColor = ([option, color]) => html`
  <span class="option-color">
    <span class=${'color-indicator ' + color} />
    ${option}
  </span>
`

const Legend = () => html`
  <div class="legend">
    ${Object.entries(optionColors).map(OptionColor)}
  </div>
`
