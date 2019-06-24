export const gibraltar = {
  gibraltarInUkProb: {
    type: 'probability',
    mergeInto: 'gibraltarInUk',
    choice: true,
  },
  gibraltarInUk: {
    type: 'boolean',
    title: 'Gibraltar is part of the UK',
    desc: 'If the UK will leave the EU, Gibraltar will stay in the UK with probability P (in the next 25 years).',
    valuedBy: ['UK', 'EU'],
    calc: c => c.ukInEu || (Math.random() < c.gibraltarInUkProb),
  },
}
