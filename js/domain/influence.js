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
}

const grid = `
  -      ukInfluenceOnEu
  ukInEu euInfluenceOnGlobal ukInfluenceOnGlobal $ukInfluenceOnGlobal
  -      ukInfluenceNotViaEu
`

export const influence = { factors, grid }
