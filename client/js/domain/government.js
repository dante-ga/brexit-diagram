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
  ukLawsForcedImpact: {
    type: 'mirrorUnitInterval',
    choice: true,
    mergeInto: 'govtEffectiveness',
    sliderLabel: 'UK laws forced by the EU',
  },
  rejectedReferendumImpact: {
    type: 'minusUnitInterval',
    choice: true,
    mergeInto: 'govtEffectiveness',
    sliderLabel: "Loss of public trust due to rejection of referendum results",
    minLabel: 'Complete shutdown',
    maxLabel: 'No impact',
  },
  govtEffectiveness: {
    type: 'unitInterval',
    title: 'UK Government effectiveness',
    desc: 'How will the following impact the effectiveness of the UK government?',
    //Relative change value. Not an absolute figure.
    calc: c => ((c.ukLawsForced) ? c.ukLawsForcedImpact : 0)
      + ((c.rejectedReferendum) ? c.rejectedReferendumImpact : 0),
    valuedBy: ['UK'],
  }
}

const diagram = `
  -      ukLawsForced       $ukLawsForced
  ukInEu -                  govtEffectiveness   $govtEffectiveness
  -      rejectedReferendum $rejectedReferendum
`

export const government = { factors, diagram }
