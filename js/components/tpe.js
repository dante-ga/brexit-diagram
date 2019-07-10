import { camel2space } from '../util.js'
const { html } = lighterhtml

const getRangeValue = (e) => {
  if (e.clientX === 0) return null
  const rect = e.target.parentElement.getBoundingClientRect()
  let value = (e.clientX - rect.left) / rect.width
  value = Math.min(Math.max(value, 0), 1)
  return value
}

const onTpePointDrag = (e, est, pointWidth) => {
  const value = getRangeValue(e)
  if (value === null) return false
  //Update DOM styles without updating the whole view
  e.target.style.left = `calc(${value * 100}% - ${pointWidth/2}px)`
  if (est === 'optimistic') {
    e.target.parentElement.querySelector('.tpe-range').style.left = value * 100 + '%'
  } else if (est === 'pessimistic') {
    e.target.parentElement.querySelector('.tpe-range').style.right = (1 - value) * 100 + '%'
  }
}

const onTpePointDragEnd = (e, onEnd) => {
  const value = getRangeValue(e)
  if (value === null) return false
  onEnd(value)
}

const clearDragImage = (e) => e.dataTransfer
  .setDragImage(document.createElement('img'), 0, 0);

const TpePoint = ({value, option, est, onChange}) => {
  const left = value * 100
  const pointWidth = 6;
  const style = `left: calc(${left}% - ${pointWidth/2}px);`
  const onEnd = (val) => onChange(option, est, val)
  return html`
    <div
      class="tpe-point"
      style=${style}
      draggable="true"
      ondrag=${(e) => onTpePointDrag(e, est, pointWidth)}
      ondragend=${(e) => onTpePointDragEnd(e, onEnd)}
      ondragstart=${clearDragImage}
    />
  `
}

const TpeOption = ({option, estimate, onChange}) => html`
  <div class="is-flex field" >
    <div  class="is-size-7 tpe-option-label tpe-padding">
      ${camel2space(option)}
    </div>
    <div class="tpe-scale is-flex-one">
      <div class="tpe-range" style=${`
        left:${estimate.optimistic * 100}%;
        right:${(1 - estimate.pessimistic) * 100}%;
      `} />
      ${['optimistic', 'mostLikely', 'pessimistic'].map((est) => TpePoint({
        value: estimate[est],
        option,
        est,
        onChange,
      }))}
    </div>
  </div>
`

const TpeRulerDash = (value) => html`
  <div
    class="tpe-ruler-dash"
    style=${`left:${value}%`}
  />
`

const TpeRulerNumber = (value) => html`
  <div
    class="tpe-ruler-number"
    style=${`left:calc(${value}% - 1.5em)`}
  >
    ${value}
  </div>
`

const TpeRuler = () => {
  const dashes = []
  for (let i = 0; i <= 10; i++) {
    dashes.push(i * 10)
  }
  const numbers = [0, 25, 50, 75, 100]
  return html`
    <div class="is-flex">
      <div class="tpe-padding" />
      <div class="tpe-ruler-scale is-flex-one">
        ${dashes.map(TpeRulerDash)}
        ${numbers.map(TpeRulerNumber)}
      </div>
    </div>
  `
}

export const ThreePointEstimates = (optionEstimates, onChange) => {
  const options = []
  for (const option in optionEstimates) {
    const estimates = []
    options.push({
      option,
      estimate: optionEstimates[option],
      onChange,
    })
  }
  return html`
    <div class="field is-size-7">
      ${options.map(TpeOption)}
      ${TpeRuler()}
    </div>
  `
}
