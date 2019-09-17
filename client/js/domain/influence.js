import { getAgentValue } from '../calc/value.js'
import { outLink } from '../components/global.js'

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
    title: 'UK’s influence on the EU',
    question: 'What is the influence of the UK on the EU if the UK remains/leaves the EU?',
    desc: `Scale: <strong>0%</strong> = no influence; <strong>100%</strong> = total control.`,
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
    title: 'EU’s global influence',
    question: "What is UK's global influence if it remains/leaves the EU?",
    desc: `Scale: <strong>0%</strong> = no influence; <strong>100%</strong> = absolute global control.`,
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
    title: 'UK’s global influence NOT via the EU',
    question: "What is UK's global influence NOT via the EU if it remains/leaves the EU?",
    desc: `Scale: <strong>0%</strong> = no influence; <strong>100%</strong> = absolute global control.`,
    calc: c => (c.ukInEu) ? c.ukInfluenceNotViaEuIn : c.ukInfluenceNotViaEuOut
  },
  ukInfluenceOnGlobal: {
    type: 'unitInterval',
    title: "UK's global influence",
    calcDesc: "UK's global influence is the sum of UK's global influences via and not via the EU. The former is the product of influences of the UK on the EU and the EU's global influence.",
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
      lower: [`Spain may force Gibraltar to leave the UK. Spain will have veto on all trade deals with Gibraltar in EU negotiatons.<br>${outLink('Spanish prime minister threatens to ‘veto Brexit’ and warns EU summit may be called off in public warning over Gibraltar', 'https://www.independent.co.uk/news/uk/politics/spain-brexit-veto-gibraltar-pedro-sanchez-theresa-may-eu-council-summit-brussels-a8648066.html')}`],
      higher: [`2002 Gibraltar sovereignty referendum showed 99% oposition even towards a shared sovereignty with Spain.<br>${outLink('Gibraltar votes out joint rule with Spain', 'https://www.theguardian.com/politics/2002/nov/08/uk.gibraltar')}`],
    },
  },
  gibraltarInUk: {
    type: 'boolean',
    title: 'British sovereignty over Gibraltar',
    question: 'What is the probability that Gibraltar will remain under British sovereignty until at least 2030 if the UK will leave the EU?',
    valuedBy: ['UK'],
    valueArguments: {
      UK: {
        lower: [],
        higher: [`Gibraltar holds a strategically important position on the northern side of the strait separating Europe from Africa at the entrance to the Mediterranean Sea from the Atlantic.<br>${outLink('Gibraltar: what is at stake?', 'https://www.telegraph.co.uk/news/worldnews/europe/spain/5878914/Gibraltar-what-is-at-stake.html')}`],
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
