export const nhs = {
  movement2nhsLabour: {
    type: 'ratio',
    choice: true,
    mergeInto: 'nhsLabourChange',
  },
  nhsLabourChange: {
    title: 'Availability of labour for NHS positions',
    type: 'mirrorUnitInterval',
    desc: "How much does the % increase in the total UK population due to immigration cause % increase of the total supply of labour available for NHS positions.",
    calc: c => c.populationChangeDueImmigration * c.movement2nhsLabour,
  },
  movement2nhsDemand: {
    type: 'ratio',
    choice: true,
    mergeInto: 'nhsDemandChange',
  },
  nhsDemandChange: {
    title: 'Demand for NHS services',
    type: 'mirrorUnitInterval',
    desc: "How much does the % increase in the total UK population due to immigration cause % increase of the total demand for NHS services.",
    calc: c => c.populationChangeDueImmigration * c.movement2nhsDemand,
  },
  euMedicineForNhs: {
    title: "Impact of EU medicine availability",
    type: 'unitInterval',
    desc: 'Please estimate how much will loss of availability of medicine due to the UK leaving the EU impact overall NHS quality.',
    sliderLabel: 'Impact',
    minLabel: 'No impact',
    maxLabel: 'End of NHS',
    choice: true,
  },
  euResearchForNhs: {
    title: "Impact of EU medical research",
    type: 'unitInterval',
    desc: 'Please estimate how much will loss of mediacal reasearch programmes due to the UK leaving the EU impact overall NHS quality.',
    sliderLabel: 'Impact',
    minLabel: 'No impact',
    maxLabel: 'End of NHS',
    choice: true,
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
    calc: c => ((1 + ((!c.ukInEu) ? -(c.euMedicineForNhs + c.euResearchForNhs) : 0)) * (1 + c.nhsLabourChange) * (1 + c.nhsBudgetChange)) / (1 + c.nhsDemandChange) - 1,
    valuedBy: ['UK'],
  }
}
