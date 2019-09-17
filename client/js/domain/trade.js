const tradeTypes = [
  { dir: 'exports to', loc: 'the EU', key: 'exportsToEu', valuedBy: ['EU']},
  { dir: 'imports from', loc: 'the EU', key: 'importsFromEu', valuedBy: ['EU']},
  { dir: 'exports to', loc: 'non-EU countries', key: 'exportsToNonEu'},
  { dir: 'imports from', loc: 'non-EU countries', key: 'importsFromNonEu'},
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
    question: `How much will UK ${dir} ${loc} change by 2030 if the UK remains/leaves the EU's single market.`,
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
    title: 'Single market tied to freedom of movement',
    calcDesc: "EU will maintain the tie between the two memberships only if the UK will be in both or will leave both.",
    calc: c => c.singleMarket === c.freedomOfMovement,
    valuedBy: ['EU'],
  },
  exchangeRateChange: {
    type: 'mirrorUnitInterval',
    title: 'GBP exchange rate',
    question: 'How much will GBP exchange rate (eg. agians the USD) change by 2030 if the UK remains/leaves the EU.',
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
