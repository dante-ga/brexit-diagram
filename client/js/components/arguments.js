const { html } = lighterhtml

const Argument = (argument) => html`
  <div class="box">
    ${argument}
  </div>
`

const Side = (title, sideArgs) => html`
  <div class="column">
    <h2 class="subtitle has-text-centered">${title}</h2>
    ${sideArgs.map(Argument)}
  </div>
`

export const Arguments = ({higher, lower}) => html`
  <div class="columns" style="margin-top: 30px;">
    ${Side('Lower', lower)}
    ${Side('Higher', higher)}
  </div>
`

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
