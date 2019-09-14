const factors = {
  movement2nhsLabour: {
    type: 'ratio',
    sliderLabel: 'Impact ratio',
    choice: true,
    mergeInto: 'nhsLabourChange',
  },
  nhsLabourChange: {
    title: 'Availability of labour for NHS positions',
    type: 'mirrorUnitInterval',
    desc: "How much does the % increase in the total UK population due to immigration cause % increase of the total supply of labour available for NHS positions.",
    calc: c => c.popChngDueImmgr * c.movement2nhsLabour,
  },
  movement2nhsDemand: {
    type: 'ratio',
    sliderLabel: 'Impact ratio',
    choice: true,
    mergeInto: 'nhsDemandChange',
  },
  nhsDemandChange: {
    title: 'Demand for NHS services',
    type: 'mirrorUnitInterval',
    desc: "How much does the % increase in the total UK population due to immigration cause % increase of the total demand for NHS services.",
    calc: c => c.popChngDueImmgr * c.movement2nhsDemand,
  },
  euMedicineForNhs: {
    title: "Impact of EU medicine availability",
    type: 'unitInterval',
    desc: 'Please estimate how much will loss of availability of medicine due to the UK leaving the EU impact overall NHS quality.',
    sliderLabel: 'Impact',
    minLabel: 'No impact',
    maxLabel: 'End of NHS',
    choice: true,
    calc: c => (c.ukInEu) ? 0 : c.euMedicineForNhs,
  },
  euResearchForNhs: {
    title: "Impact of EU medical research",
    type: 'unitInterval',
    desc: 'Please estimate how much will loss of mediacal reasearch programmes due to the UK leaving the EU impact overall NHS quality.',
    sliderLabel: 'Impact',
    minLabel: 'No impact',
    maxLabel: 'End of NHS',
    choice: true,
    calc: c => (c.ukInEu) ? 0 : c.euResearchForNhs,
  },
  nhsBudgetChange: {
    title: "Change to NHS budget",
    type: 'mirrorUnitInterval',
    desc: 'This is assumed to be proportional to the change in the overall governemt spending.',
    calc: c => c.govtSpendingChange
  },
  nhsPerformance: {
    title: "NHS performance",
    type: 'mirrorUnitInterval',
    desc: 'Change in quality/quanitity of services provided by the NHS based on a combination of factors.',
    calc: c => (
      (1 - c.euMedicineForNhs - c.euResearchForNhs)
      * (1 + c.nhsLabourChange)
      * (1 + c.nhsBudgetChange)
    ) / (1 + c.nhsDemandChange) - 1,
    valuedBy: ['UK'],
  },
  researchColab_remain: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After remaining in the EU",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'researchColab',
  },
  researchColab_deal: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After leaving the EU with a deal",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'researchColab',
  },
  researchColab_noDeal: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After no-deal Brexit",
    minLabel: 'No collaboration',
    maxLabel: 'Full collaboration',
    mergeInto: 'researchColab',
  },
  researchColab: {
    title: 'Scientific research collaboration with the EU',
    desc: 'Please estimate how much scientific research collaboration with the EU will there  be in the following cases.',
    type: 'unitInterval',
    calc: c => c['researchColab_' + c.brexitApproval],
    valuedBy: ['UK'],
  },
}

const diagram = `
  popChngDueImmgr    nhsLabourChange
  -                  nhsDemandChange
  ukInEu             euMedicineForNhs nhsPerformance $nhsPerformance
  -                  euResearchForNhs
  govtSpendingChange nhsBudgetChange
  brexitApproval     -                researchColab $researchColab
`

export const nhs = { factors, diagram }
