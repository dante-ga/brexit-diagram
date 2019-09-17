const { html } = lighterhtml

const SubmitArguments = () => html`
  <div class="notification">
    No arguments yet. Please select one of the sliders and leave relevant arguments in the comments below. They will be added here after a review.
  </div>
`

const SelectArguments = () => html`
  <div class="notification">
    Please select one of the sliders to view relevant arguments.
  </div>
`

const NoArguments = () => html`
  <div class="notification">
    <span>No arguments yet.</span>
  </div>
`

const Argument = (argument) => html`
  <div class="box">
    ${html([argument])}
  </div>
`

export const Arguments = (_arguments, dontSelect) => {
  if (dontSelect) {
    return SubmitArguments()
  }
  if (_arguments === null) {
    return SelectArguments()
  }
  const {higher, lower} = _arguments || {higher:[], lower:[]}
  return html`
    <div class="columns">
      <div class="column">
        <h2 class="subtitle has-text-centered">
          <span class="icon">
            <i class="fas fa-angle-double-left" />
          </span>
          <span>Lower because...</span>
        </h2>
        ${(lower.length > 0) ? lower.map(Argument) : NoArguments()}
      </div>
      <div class="column">
        <h2 class="subtitle has-text-centered">
          <span>Higher because...</span>
          <span class="icon">
            <i class="fas fa-angle-double-right" />
          </span>
        </h2>
        ${(higher.length > 0) ? higher.map(Argument) : NoArguments()}
      </div>
    </div>
    <div class="notification has-text-centered">
      Please leave relevant missing arguments in the comments below. They will be added here after a review.
    </div>
  `
}

export const RadioAddon = (fieldKey, field, active, activate) => html`
  <div class="is-flex is-va-center">
    <label class="radio">
      <input
        class="is-checkradio"
        id=${'radioAddon_' + fieldKey}
        type="radio"
        name="radioAddon"
        checked=${active}
        onclick=${activate}
      >
      <label for=${'radioAddon_' + fieldKey} ></label>
    </label>
    <div class="is-flex-one">
      ${field}
    </div>
  </div>
`
