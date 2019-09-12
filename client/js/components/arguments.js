const { html } = lighterhtml

const SelectArguments = () => html`
  <div class="notification">
    Please select one of the sliders to view relevant arguments.
  </div>
`

const NoArguments = () => html`
  <div class="notification">
    <span>No arguments yet. If you have one, please leave it in the comments bellow. It will be added up here after a review.</span>
  </div>
`

const Argument = (argument) => html`
  <div class="box">
    ${argument}
  </div>
`

export const Arguments = (_arguments) => {
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
