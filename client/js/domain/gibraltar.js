import { getAgentValue } from '../calc/value.js'

const factors = {
  gibraltarInUkProb: {
    type: 'unitInterval',
    mergeInto: 'gibraltarInUk',
    choice: true,
    sliderLabel: 'Probability P',
    minLabel: 'Impossible',
    maxLabel: 'Absolutely certain',
    arguments: {
      lower: ['Spain may force Gibraltar to leave the UK. Spain will have veto on all trade deals with Gibraltar in EU negotiatons.'],
      higher: ['2002 Gibraltar sovereignty referendum showed 99% oposition even towards a shared sovereignty with Spain.'],
    },
  },
  gibraltarInUk: {
    type: 'boolean',
    title: 'British sovereignty over Gibraltar',
    desc: 'If the UK will leave the EU, Gibraltar will remain under British sovereignty with probability P (in the next 25 years).',
    valuedBy: ['UK'],
    valueArguments: {
      UK: {
        lower: [],
        higher: ['"Gibraltar holds a strategically important position on the northern side of the strait separating Europe from Africa at the entrance to the Mediterranean Sea from the Atlantic."'],
      }
    },
    calc: c => c.ukInEu || (Math.random() < c.gibraltarInUkProb),
  },
}

const diagram = `
  ukInEu gibraltarInUk $gibraltarInUk
`

const getValue = (vals) => {
  const subValue = ((vals.ukInEu) ? 1 : vals.gibraltarInUkProb)
    * getAgentValue('gibraltarInUk', true, 'UK')
  const subNodeValues = { gibraltarInUk: subValue }
  return { subValue, subNodeValues }
}

export const gibraltar = { factors, diagram, getValue }
