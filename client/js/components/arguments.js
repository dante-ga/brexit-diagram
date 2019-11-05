import { Button } from './global.js'
import { html } from '../../third_party/lit-html/lit-html.js'
import { unsafeHTML } from '../../third_party/lit-html/directives/unsafe-html.js'

const Argument = (argument) => html`
  <div class="box">
    ${unsafeHTML(argument)}
  </div>
`

const UnmodArg = (unmodArg) => html`
  <div class="box has-background-white-ter has-text-grey is-italic">
    ${unmodArg}
  </div>
`

const titles = {
  lower: () => html`
    <span class="icon">
      <i class="fas fa-angle-double-left" ></i>
    </span>
    <span>Lower because...</span>
  `,
  higher: () => html`
    <span>Higher because...</span>
    <span class="icon">
      <i class="fas fa-angle-double-right" ></i>
    </span>
  `
}

const sideAlt = {
  lower: 'left',
  higher: 'right',
}

const UnmodArgButton = ({label, onClick}) => html`
  <button
    class="button field is-fullwidth has-text-grey"
    @click=${onClick}
  >
    ${label}
  </button>
`

export const UnmodArgs = (showUnmodArgs, sideUnmodArgs, setUnmodArgs) => {
  if (sideUnmodArgs.length > 0) {
    if (showUnmodArgs) {
      return [
        UnmodArgButton({
          label: 'Hide unmoderated arguments',
          onClick: () => setUnmodArgs(false),
        }),
        ...sideUnmodArgs.map(UnmodArg)
      ]
    } else {
      return html`${UnmodArgButton({
        label: `Show unmoderated arguments (${sideUnmodArgs.length})`,
        onClick: () => setUnmodArgs(true),
      })}`
    }
  } else {
    return ''
  }
}

export const ArgumentsColumn = ({
  path,
  side,
  sideArguments,
  showUnmodArgs,
  sideUnmodArgs,
  setUnmodArgs,
  multipleFields,
  onChange,
  areaText,
  addArgument,
}) => html`
  <div class="column">
    <h2 class="subtitle has-text-centered">
      ${titles[side]()}
    </h2>
    ${sideArguments.map(Argument)}
    ${UnmodArgs(showUnmodArgs, sideUnmodArgs, setUnmodArgs)}
    <textarea
      class="textarea field"
      placeholder=${`Why should the ${(multipleFields) ? 'selected ' : ''}slider be moved to the ${sideAlt[side]}?`}
      @change=${onChange}
      id=${path + '_' + side + 'textarea'}
      .value=${areaText}
    ></textarea>
    <div class="field">
      ${Button({
        label: 'Add argument',
        onClick: addArgument,
      })}
    </div>
  </div>
`

export const Arguments = (columns) => html`
  <div class="columns">
    ${columns}
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
        ?checked=${active}
        @click=${activate}
      >
      <label for=${'radioAddon_' + fieldKey} ></label>
    </label>
    <div class="is-flex-one">
      ${field}
    </div>
  </div>
`
