import { types } from '../types.js'

const { html, svg } = lighterhtml

const width = 641
const countHeight = 30

const optionColors = {
  remain: 'orange',
  deal: 'blue',
}

const Layer = ({option, bins, height}) => {
  const color = optionColors[option]
  const h = height + 1
  const commands = ['M 0 ' + h]
  for (const bin of bins) {
    commands.push('V ' + (h - bin * countHeight))
    commands.push('h ' + ((width - 1) / bins.length))
  }
  commands.push('V ' + h)
  commands.push('H 0')
  let d = commands.join(' ')
  return svg`<path d=${d} stroke=${color} fill=${color} fill-opacity="0.2" />`
}

const HistogramSvg = (options, height) => svg`
  <svg width=${width} height=${height} class="histogram">
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
    <div style=${'width:'+width+'px;'} class="histogram-cont field">
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

const RulerDash = (position) => html`
  <div
    class="ruler-dash"
    style=${`left:${position * 100}%`}
  />
`

const RulerNumber = ([position, text]) => html`
  <div
    class="ruler-number"
    style=${`left:calc(${position * 100}% - 1.5em)`}
  >
    ${text}
  </div>
`

const Ruler = (type) => {
  const positions = [0, 0.25, 0.5, 0.75, 1]
  const {min, max, getText} = types[type]
  const vals = positions.map(
    position => [position, getText(min + (max - min) * position)]
  )
  return html`
    <div class="is-flex">
      <div class="ruler-scale is-flex-one">
        ${positions.map(RulerDash)}
        ${vals.map(RulerNumber)}
      </div>
    </div>
  `
}
