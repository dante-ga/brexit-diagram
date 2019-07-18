const factors = {
  gdppcChange: {
    title: 'Change in UK GDP per person',
    type: 'mirrorUnitInterval',
    desc: 'This combines changes in gdp and population.',
    valuedBy: ['UK'],
    /* X =
      = gdppcNew/gdppcOld - 1
      = (gdpNew/popNew)/(gdpOld/popOld) - 1
      = (gdpNew/gdpOld)/(popNew/popOld) - 1
      = (1 + c.gdpChange)/(1 + c.ukPopulationChange) - 1
    */
    calc: c => (1 + c.gdpChange)/(1 + c.ukPopulationChange) - 1,
  }
}

const grid = `
  gdpChange          gdppcChange $gdppcChange
  ukPopulationChange
`

export const gdppc = { factors, grid }
