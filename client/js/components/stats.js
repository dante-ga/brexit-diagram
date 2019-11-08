import { Ruler } from '../components/inputs.js'

import { html, svg } from '../../third_party/lit-html/lit-html.js'

const width = 1040
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
    height=${height}
    class="histogram"
    viewBox=${'0 0 ' + width + ' ' + height}
    preserveAspectRatio="none"
  >
    ${Object.entries(options).map(([option, bins]) => Layer({option, bins, height}))}
  </svg>
`

export const Histogram = (options, type, label, decisionOptionLabels, showLegend) => {
  let maxCount = 0
  for (const option in options) {
    maxCount = Math.max(maxCount, ...options[option])
  }
  const height = maxCount * countHeight
  return html`
    <div class="histogram-cont field">
      <div class="is-flex is-space-between field">
        <div>${label}</div>
        ${(showLegend) ? Legend(decisionOptionLabels) : ''}
      </div>
      ${HistogramSvg(options, height)}
      ${Ruler(type)}
    </div>
  `
}

const OptionColor = (option, color) => html`
  <span class="option-color">
    <span class=${'color-indicator ' + color} ></span>
    ${option}
  </span>
`

const Legend = (decisionOptionLabels) => html`
  <div class="legend">
    ${Object.entries(optionColors).map(([option, color]) => OptionColor(decisionOptionLabels[option], color))}
  </div>
`
