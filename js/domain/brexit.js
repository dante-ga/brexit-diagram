export const brexit = {
  brexitApproval: {
    type: 'option',
    title: 'UK Brexit decision',
    desc: 'UK picks the following Brexit option:',
    options: {
      remain: 'Remain',
      deal: 'Deal',
      noDeal: 'No-deal',
    },
    choice: true,
  },
  ukInEu: {
    type: 'boolean',
    title: "UK's membership in the EU",
    desc: "Unless it remains in the EU, the UK will be effectively outside the EU immediately after no-deal Brexit or after the two year transition period as per the Brexit deal.",
    calc: c => c.brexitApproval === 'remain',
  },
}
