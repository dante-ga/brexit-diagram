export const research = {
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
