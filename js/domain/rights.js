const factors = {
  legalRights_remain: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After remaining in the EU",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'legalRights',
  },
  legalRights_deal: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After leaving the EU with a deal",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'legalRights',
  },
  legalRights_noDeal: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After no-deal Brexit",
    minLabel: 'No rights',
    maxLabel: 'Full rights',
    mergeInto: 'legalRights',
  },
  legalRights: {
    title: 'Legal rights of UK citizens in the EU',
    desc: 'Please estimate the fullness of legal rights which UK sitiezens will have in the EU in the following cases.',
    type: 'unitInterval',
    calc: c => c['legalRights_' + c.brexitApproval],
    valuedBy: ['UK'],
  },
}

const grid = `
  brexitApproval legalRights $legalRights
`

export const rights = { factors, grid }
