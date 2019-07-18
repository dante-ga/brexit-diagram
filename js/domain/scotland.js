const factors = {
  scotlandApproval: {
    title: "Scottish independence intention",
    type: 'boolean',
    choice: true,
    checkboxLabel: 'Intends',
  },
  indScotProb: {
    type: 'unitInterval',
    mergeInto: 'independentScotland',
    choice: true,
    sliderLabel: 'Probability P',
    minLabel: 'Impossible',
    maxLabel: 'Absolutely certain',
  },
  independentScotland: {
    title: 'Scottish independence',
    type: 'boolean',
    desc: "If Scotland decides to become independent then with probability P it will become independent.",
    valuedBy: ['UK', 'Scotland'],
    calc: c => c.scotlandApproval && (Math.random() < c.indScotProb)
  },
  scotEuMemberProb: {
    type: 'unitInterval',
    mergeInto: 'scotlandEuMember',
    choice: true,
    sliderLabel: 'Probability P',
    minLabel: 'Impossible',
    maxLabel: 'Absolutely certain',
  },
  scotlandEuMember: {
    title: 'Scotland is a member of the EU',
    type: 'boolean',
    desc: "If Scotland will become independent then with probability P it will join the EU.",
    calc: c => c.independentScotland && (Math.random() < c.scotEuMemberProb)
  },
  scotlandInEu: {
    title: 'Scotland is in the EU',
    type: 'boolean',
    desc: "Scotland will be in the EU if it will become an EU member or if Scotland will remain in the UK which will remain in the EU.",
    valuedBy: ['Scotland'],
    calc: c => c.scotlandEuMember || (c.ukInEu && !c.independentScotland)
  },
}

const grid = `
  -                -                   $independentScotland -
  scotlandApproval independentScotland scotlandEuMember     scotlandInEu $scotlandInEu
  -                -                   ukInEu               -
`

export const scotland = { factors, grid }
