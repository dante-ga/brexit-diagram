export const exchange = {
  exchangeRateChangeIn: {
    type: 'mirrorUnitInterval',
    choice: true,
    mergeInto: 'exchangeRateChange',
    sliderLabel: "'Remain' change",
  },
  exchangeRateChangeOut: {
    type: 'mirrorUnitInterval',
    choice: true,
    mergeInto: 'exchangeRateChange',
    sliderLabel: "'Leave' change",
  },
  exchangeRateChange: {
    type: 'mirrorUnitInterval',
    title: 'GBP exchange rate change',
    desc: 'Please estimate the long term change of GBP exchange rate (eg. agians the USD) in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.exchangeRateChangeIn : c.exchangeRateChangeOut,
    valuedBy: ['UK']
  },
}
