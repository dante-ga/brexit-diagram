import { getAgentValue } from '../calc/value.js'

const factors = {
  gibraltarInUkProb: {
    type: 'unitInterval',
    mergeInto: 'gibraltarInUk',
    choice: true,
    sliderLabel: 'Probability P',
    minLabel: 'Impossible',
    maxLabel: 'Absolutely certain',
  },
  gibraltarInUk: {
    type: 'boolean',
    title: 'Gibraltar is part of the UK',
    desc: 'If the UK will leave the EU, Gibraltar will stay in the UK with probability P (in the next 25 years).',
    valuedBy: ['UK'],
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
