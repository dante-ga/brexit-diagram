const factors = {
  movement2nhsLabour: {
    type: 'ratio',
    sliderLabel: 'Impact ratio',
    choice: true,
    mergeInto: 'nhsLabourChange',
  },
  nhsLabourChange: {
    title: 'NHS recruitment',
    type: 'mirrorUnitInterval',
    question: 'What is the ratio between the increase in the total UK population due to immigration and the increase of the supply of labour available for NHS positions that it causes?',
    desc: `Scale: <strong>0</strong> = no impact; <strong>1</strong> = proportional impact (i.e. an increase in population by 1% causes an increase of the supply of labour by 1%); <strong>2</strong> = double impact.`,
    calc: c => c.popChngDueImmgr * c.movement2nhsLabour,
  },
  movement2nhsDemand: {
    type: 'ratio',
    sliderLabel: 'Impact ratio',
    choice: true,
    mergeInto: 'nhsDemandChange',
  },
  nhsDemandChange: {
    title: 'Demand for NHS',
    type: 'mirrorUnitInterval',
    desc: "How much does the % increase in the total UK population due to immigration cause % increase of the total demand for NHS services.",
    question: 'What is the ratio between the increase in the total UK population due to immigration and the increase of the total demand for NHS services that it causes?',
    desc: `Scale: <strong>0</strong> = no impact; <strong>1</strong> = proportional impact (i.e. an increase in population by 1% causes an increase of the demand by 1%); <strong>2</strong> = double impact.`,
    calc: c => c.popChngDueImmgr * c.movement2nhsDemand,
  },
  euMedicineForNhs: {
    title: "EU medicine availability",
    type: 'unitInterval',
    question: 'How much will loss of availability of medicine due to the UK leaving the EU impact overall NHS quality?',
    desc: `Scale: <strong>0%</strong> = no impact; <strong>100%</strong> = complete shutdown of the NHS.`,
    sliderLabel: 'Impact',
    choice: true,
    calc: c => (c.ukInEu) ? 0 : c.euMedicineForNhs,
  },
  euResearchForNhs: {
    title: "EU medical research",
    type: 'unitInterval',
    question: 'How much will loss of medical research programs due to the UK leaving the EU impact overall NHS quality?',
    desc: `Scale: <strong>0%</strong> = no impact; <strong>100%</strong> = complete shutdown of the NHS.`,
    sliderLabel: 'Impact',
    choice: true,
    calc: c => (c.ukInEu) ? 0 : c.euResearchForNhs,
  },
  nhsBudgetChange: {
    title: "NHS budget",
    type: 'mirrorUnitInterval',
    calcDesc: 'The change of the NHS budget is assumed to be proportional to the change in the overall government spending.',
    calc: c => c.govtSpendingChange
  },
  nhsPerformance: {
    title: "NHS performance",
    type: 'mirrorUnitInterval',
    desc: 'Change in the general performance of the National Health Service in the UK in terms of waiting times, treatment quality and availability etc.',
    calcDesc: 'The total change is the product of the effects of changes in <a href="/factor/euMedicineForNhs">EU medicine</a>, <a href="/factor/euResearchForNhs">EU research</a>, <a href="/factor/nhsLabourChange">immigrant labour</a> and <a href="/factor/nhsBudgetChange">NHS budget</a> availability as well as the change to the <a href="/factor/nhsDemandChange">demand for the services</a>.',
    calc: c => (
      (1 - c.euMedicineForNhs)
      * (1 - c.euResearchForNhs)
      * (1 + c.nhsLabourChange)
      * (1 + c.nhsBudgetChange)
    ) / (1 + c.nhsDemandChange) - 1,
    valuedBy: ['UK'],
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
    title: 'Scientific collab. with the EU',
    question: 'How much of the scientific research collaboration with the EU will continue after leaving the EU with/without a deal?',
    type: 'unitInterval',
    calc: c => (c.brexitApproval === 'remain') ? 1 : c['researchColab_' + c.brexitApproval],
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
