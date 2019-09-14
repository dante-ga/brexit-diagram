const tradeTypes = [
  { dir: 'exports to', loc: 'the EU', key: 'exportsToEu', valuedBy: ['EU']},
  { dir: 'imports from', loc: 'the EU', key: 'importsFromEu', valuedBy: ['EU']},
  { dir: 'exports to', loc: 'non-EU', key: 'exportsToNonEu'},
  { dir: 'imports from', loc: 'non-EU', key: 'importsFromNonEu'},
]

const accessTypes = [
  { suffix: 'In', label: 'Remains in the single market' },
  { suffix: 'Out', label:  'Leaves the single market' },
]

export const factors = {}

for (const {dir, loc, key, valuedBy} of tradeTypes) {
  for (const {suffix, label} of accessTypes) {
    const accessKey = key + suffix
    factors[accessKey] = {
      type: 'mirrorUnitInterval',
      choice: true,
      mergeInto: key,
      sliderLabel: label,
    }
  }
  factors[key] = {
    type: 'mirrorUnitInterval',
    title: `UK ${dir} ${loc}`,
    desc: `Please estimate the long term change of UK ${dir} ${loc} in cases where the UK effectively remains or leaves the EU's single market.`,
    calc: c => c[key + accessTypes[(c.singleMarket) ? 0 : 1].suffix],
  }
  if (valuedBy) factors[key].valuedBy = valuedBy
}

Object.assign(factors, {
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
  marketMovementTied: {
    type: 'boolean',
    title: 'Market tied to movement',
    desc: "The access to the single market and the freedom of movement across the EU are tied together.",
    calc: c => c.singleMarket === c.freedomOfMovement,
    valuedBy: ['EU'],
  },
  exchangeRateChange: {
    type: 'mirrorUnitInterval',
    title: 'GBP exchange rate change',
    desc: 'Please estimate the long term change of GBP exchange rate (eg. agians the USD) in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.exchangeRateChangeIn : c.exchangeRateChangeOut,
    valuedBy: ['UK']
  },
})

const diagram = `
  -                 exportsToEu        $exportsToEu
  -                 importsFromEu      $importsFromEu
  singleMarket      exportsToNonEu
  -                 importsFromNonEu
  freedomOfMovement marketMovementTied $marketMovementTied
  ukInEu            exchangeRateChange $exchangeRateChange
`

export const trade = { factors, diagram }
