const factors = {
  ukLawsForced: {
    type: 'boolean',
    title: 'UK laws forced by the EU',
    desc: 'As a member of the EU, the UK is obligated to legislate its laws.',
    calc: c => c.ukInEu,
    valuedBy: ['UK'],
  },
  rejectedReferendum: {
    type: 'boolean',
    title: 'Referendum results rejected',
    desc: 'Remaining in the EU would mean rejection of the results of the referendum.',
    calc: c => c.ukInEu,
    valuedBy: ['UK'],
  },
  ukLawsForcedPositive: {
    type: 'boolean',
    choice: true,
    mergeInto: 'govtEffectiveness',
    checkboxLabel: "The obligation to legislate EU laws increases effectiveness of the UK goverment.",
  },
  ukLawsForcedDetermine: {
    type: 'unitInterval',
    choice: true,
    mergeInto: 'govtEffectiveness',
    sliderLabel: 'UK laws forced by the EU',
    minLabel: '',
    maxLabel: '',
  },
  publicTrustDetermine: {
    type: 'unitInterval',
    choice: true,
    mergeInto: 'govtEffectiveness',
    sliderLabel: "Loss of public trust due to rejection of referendum results",
    minLabel: 'No impact',
    maxLabel: 'Determines completely',
  },
  govtEffectiveness: {
    type: 'unitInterval',
    title: 'UK Government effectiveness',
    desc: 'Please estimate to what extent can the following factors determine the effectiveness of the UK goverment.',
    //TODO: add note: "Since we are only interested in change in effectiveness rather than its absolute value the remaining effectiveness was set to a half."
    calc: c => (
      (c.ukLawsForcedPositive && c.ukLawsForced
      || (!c.ukLawsForcedPositive && !c.ukLawsForced)
    ) ? c.ukLawsForcedDetermine : 0)
    + ((c.rejectedReferendum) ? 0 : c.publicTrustDetermine)
    + (1 - c.ukLawsForcedDetermine - c.publicTrustDetermine) / 2,
    valuedBy: ['UK'],
  }
}

const diagram = `
  -      ukLawsForced       $ukLawsForced
  ukInEu -                  govtEffectiveness   $govtEffectiveness
  -      rejectedReferendum $rejectedReferendum
`

export const government = { factors, diagram }
