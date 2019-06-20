export const scotland = {
  scotlandApproval: {
    title: "Scottish independence intention",
    type: 'boolean',
    choice: true,
  },
  indScotProb: {
    type: 'probability',
    mergeInto: 'independentScotland',
    choice: true,
  },
  independentScotland: {
    title: 'Scottish independence',
    type: 'boolean',
    desc: "If Scotland decides to become independent then with probability P it will become independent.",
    valuedBy: ['UK', 'Scotland'],
    calc: c => c.scotlandApproval && (Math.random() < c.indScotProb)
  },
  scotEuMemberProb: {
    type: 'probability',
    mergeInto: 'scotlandEuMember',
    choice: true,
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
