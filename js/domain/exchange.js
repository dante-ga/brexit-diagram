export const exchange = {
  exchangeRateChangeIn: {
    type: 'change',
    choice: true,
    mergeInto: 'exchangeRateChange',
    change: {
      min: -1,
      max: 1,
      label: "'Remain' change",
      change: true,
    },
  },
  exchangeRateChangeOut: {
    type: 'change',
    choice: true,
    mergeInto: 'exchangeRateChange',
    change: {
      min: -1,
      max: 1,
      label: "'Leave' change",
      change: true,
    },
  },
  exchangeRateChange: {
    type: 'change',
    title: 'GBP exchange rate change',
    desc: 'Please estimate the long term change of GBP exchange rate (eg. agians the USD) in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.exchangeRateChangeIn : c.exchangeRateChangeOut,
    valuedBy: ['UK']
  },
}
