import { html } from '../../third_party/lit-html/lit-html.js'
import { ifDefined } from '../../third_party/lit-html/directives/if-defined.js'
import { Ruler } from '../components/inputs.js'

const RadioOptions = ({options, name, onClick, checkedValue}) => options.map(({label, value}) => html`
  <label class="radio">
    <input
      class="is-checkradio"
      id=${'radioSurvey_' + name + '_' + value}
      type="radio"
      name=${'radioSurvey_' + name }
      value=${value}
      @click=${() => onClick(value)}
      ?checked=${checkedValue === value}
    >
    <label for=${'radioSurvey_' + name + '_' + value} >
      ${label}
    </label>
  </label>
`)

const fieldTypes = {
  textarea: ({value, onChange}) => html`
    <textarea
      class="textarea"
      rows="2"
      @change=${onChange}
      .value=${value || ''}
    ></textarea>
  `,
  text: ({value, onChange}) => html`
    <input
      class="input"
      type="text"
      @change=${onChange}
      .value=${value || ''}
    >
  `,
  probability: ({value, onChange}) => html`
    <input
      class="slider is-fullwidth"
      type="range"
      step="0.01"
      min="0"
      max="1"
      @change=${onChange}
      .value=${value || 0.5}
    >
    ${Ruler('unitInterval')}
  `,
  email: ({recieve, onClick, value, onChange}) => {
    const content = []
    const radioOptions = RadioOptions({
      options: [
        {label: 'Yes', value: true},
        {label: 'No', value: false}
      ],
      name: 'recieveNews',
      checkedValue: recieve,
      onClick,
    })
    content.push(html`
      <div class="field">
        ${radioOptions}
      </div>
    `)
    if (recieve) {
      content.push(html`
      <div>
        <label for="email">Please enter your email address:</label>
        <input
          class="input"
          type="email"
          id="email"
          @change=${onChange}
          .value=${value || ''}
        >
      </div>
      `)
    }
    return content
  }
}

const Question = (qo, qi) => html`
  <div class="margin-top-lg">
    <h2 class="subtitle">
      <strong>Q${qi + 1}:</strong>
      ${qo.question}
    </h2>
    ${fieldTypes[qo.type](qo)}
  </div>
`

const Title = () => html`
  <h1 class="title has-text-centered">
    Please let me know what you think!
  </h1>
`

const Thanks = () => html`
  <h1 class="title">Thank you for your feedback!</h2>
`

const Submit = ({onSubmit, submitting, submitted}) => html`
  <div class="margin-top-lg has-text-centered">
    ${(submitted) ? Thanks() : ''}
    <button
      class=${"button " + ((submitting) ? 'is-loading ' : '') + ((submitted) ? '' : 'is-primary is-large')}
      @click=${onSubmit}
    >
      Submit ${(submitted) ? 'again' : ''}
    </button>
  </div>
`

export const Survey = ({questionArray, onSubmit, submitting, submitted}) => [
  Title(),
  ...questionArray.map(Question),
  Submit({onSubmit, submitting, submitted})
]
