export const influence = {
  ukInfluenceOnEuIn: {
    type: 'probability',
    choice: true,
    mergeInto: 'ukInfluenceOnEu',
    probability: {
      min: '',
      max: '',
      label: "'Remain' influence"
    },
  },
  ukInfluenceOnEuOut: {
    type: 'probability',
    choice: true,
    mergeInto: 'ukInfluenceOnEu',
    probability: {
      min: 'No control',
      max: 'Total control',
      label: "'Leave' influence"
    },
  },
  ukInfluenceOnEu: {
    type: 'probability',
    title: 'UK’s influence on EU politics',
    desc: 'Please estimate the influence of the UK on EU politics in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.ukInfluenceOnEuIn : c.ukInfluenceOnEuOut
  },
  euInfluenceOnGlobalIn: {
    type: 'probability',
    choice: true,
    mergeInto: 'euInfluenceOnGlobal',
    probability: {
      min: '',
      max: '',
      label: "'Remain' influence"
    },
  },
  euInfluenceOnGlobalOut: {
    type: 'probability',
    choice: true,
    mergeInto: 'euInfluenceOnGlobal',
    probability: {
      min: 'No control',
      max: 'Total control',
      label: "'Leave' influence"
    },
  },
  euInfluenceOnGlobal: {
    type: 'probability',
    title: 'EU’s influence on global politics',
    desc: 'Please estimate the influence of the EU on global politics in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.euInfluenceOnGlobalIn : c.euInfluenceOnGlobalOut
  },
  ukInfluenceNotViaEuIn: {
    type: 'probability',
    choice: true,
    mergeInto: 'ukInfluenceNotViaEu',
    probability: {
      min: '',
      max: '',
      label: "'Remain' influence"
    },
  },
  ukInfluenceNotViaEuOut: {
    type: 'probability',
    choice: true,
    mergeInto: 'ukInfluenceNotViaEu',
    probability: {
      min: 'No control',
      max: 'Total control',
      label: "'Leave' influence"
    },
  },
  ukInfluenceNotViaEu: {
    type: 'probability',
    title: 'UK’s influence on global politics NOT via the EU',
    desc: 'Please estimate the influence of the UK on global politics NOT via the EU in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.ukInfluenceNotViaEuIn : c.ukInfluenceNotViaEuOut
  },
  ukInfluenceOnGlobal: {
    type: 'probability',
    title: 'UK’s influence on global politics',
    desc: "It is calculated as the sum of UK's influences on global politics via and not via the EU. The former is the product of influences of the UK on the EU politics and the EU on the global politics.",
    calc: c =>  Math.min(1, c.ukInfluenceNotViaEu + c.ukInfluenceOnEu * c.euInfluenceOnGlobal),
    valuedBy: ['UK'],
  },
}
