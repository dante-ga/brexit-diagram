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

const diagram = `
  -            exportsToEu      $exportsToEu
  singleMarket importsFromEu    $importsFromEu
  -            exportsToNonEu   -
  -            importsFromNonEu -
`

export const trade = { factors, diagram }
