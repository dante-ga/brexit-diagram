import { getAgentValue } from '../calc/value.js'

const factors = {
  ukInfluenceOnEuIn: {
    type: 'unitInterval',
    choice: true,
    mergeInto: 'ukInfluenceOnEu',
    sliderLabel: "'Remain' influence",
    minLabel: '',
    maxLabel: '',
  },
  ukInfluenceOnEuOut: {
    type: 'unitInterval',
    choice: true,
    mergeInto: 'ukInfluenceOnEu',
    sliderLabel: "'Leave' influence",
    minLabel: 'No control',
    maxLabel: 'Total control',
  },
  ukInfluenceOnEu: {
    type: 'unitInterval',
    title: 'UK’s influence on EU politics',
    desc: 'Please estimate the influence of the UK on EU politics in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.ukInfluenceOnEuIn : c.ukInfluenceOnEuOut
  },
  euInfluenceOnGlobalIn: {
    type: 'unitInterval',
    choice: true,
    mergeInto: 'euInfluenceOnGlobal',
    sliderLabel: "'Remain' influence",
    minLabel: '',
    maxLabel: '',
  },
  euInfluenceOnGlobalOut: {
    type: 'unitInterval',
    choice: true,
    mergeInto: 'euInfluenceOnGlobal',
    sliderLabel: "'Leave' influence",
    minLabel: 'No control',
    maxLabel: 'Total control',
  },
  euInfluenceOnGlobal: {
    type: 'unitInterval',
    title: 'EU’s influence on global politics',
    desc: 'Please estimate the influence of the EU on global politics in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.euInfluenceOnGlobalIn : c.euInfluenceOnGlobalOut
  },
  ukInfluenceNotViaEuIn: {
    type: 'unitInterval',
    choice: true,
    mergeInto: 'ukInfluenceNotViaEu',
    sliderLabel: "'Remain' influence",
    minLabel: '',
    maxLabel: '',
  },
  ukInfluenceNotViaEuOut: {
    type: 'unitInterval',
    choice: true,
    mergeInto: 'ukInfluenceNotViaEu',
    sliderLabel: "'Leave' influence",
    minLabel: 'No control',
    maxLabel: 'Total control',
  },
  ukInfluenceNotViaEu: {
    type: 'unitInterval',
    title: 'UK’s influence on global politics NOT via the EU',
    desc: 'Please estimate the influence of the UK on global politics NOT via the EU in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.ukInfluenceNotViaEuIn : c.ukInfluenceNotViaEuOut
  },
  ukInfluenceOnGlobal: {
    type: 'unitInterval',
    title: 'UK’s influence on global politics',
    desc: "It is calculated as the sum of UK's influences on global politics via and not via the EU. The former is the product of influences of the UK on the EU politics and the EU on the global politics.",
    calc: c =>  Math.min(1, c.ukInfluenceNotViaEu + c.ukInfluenceOnEu * c.euInfluenceOnGlobal),
    valuedBy: ['UK'],
  },
  gibraltarInUkProb: {
    type: 'unitInterval',
    mergeInto: 'gibraltarInUk',
    choice: true,
    sliderLabel: 'Probability',
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
    desc: 'What is the probability that Gibraltar will remain under British sovereignty until at least 2030 if the UK will leave the EU?',
    valuedBy: ['UK'],
    valueArguments: {
      UK: {
        lower: [],
        higher: ['"Gibraltar holds a strategically important position on the northern side of the strait separating Europe from Africa at the entrance to the Mediterranean Sea from the Atlantic."'],
      }
    },
    customCalc: true,
    calc: c => c.ukInEu || (Math.random() < c.gibraltarInUkProb),
  },
}

const diagram = `
  -      ukInfluenceOnEu
  ukInEu euInfluenceOnGlobal ukInfluenceOnGlobal $ukInfluenceOnGlobal
  -      ukInfluenceNotViaEu
  -      -                   gibraltarInUk       $gibraltarInUk
`

const getGibraltarValue = (vals) => {
  const subValue = ((vals.ukInEu) ? 1 : vals.gibraltarInUkProb)
    * getAgentValue('gibraltarInUk', true, 'UK')
  const subNodeValues = { gibraltarInUk: subValue }
  return { subValue, subNodeValues }
}

export const influence = { factors, diagram, getGibraltarValue }
