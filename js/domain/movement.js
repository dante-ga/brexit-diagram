const factors = {
  ukPopulationChangeOpen: {
    type: 'mirrorUnitInterval',
    choice: true,
    sliderLabel: 'Freedom of movement with EU',
    min: -0.5,
    max: 0.5,
    mergeInto: 'ukPopulationChange',
  },
  ukPopulationChangeClosed: {
    type: 'mirrorUnitInterval',
    choice: true,
    sliderLabel: 'No freedom of movement with EU',
    min: -0.5,
    max: 0.5,
    mergeInto: 'ukPopulationChange',
  },
  ukPopulationChange: {
    title: 'Total UK population change',
    type: 'mirrorUnitInterval',
    desc: 'Please estimate the % change of the total population of the UK in 2030 for two cases of migration policy.',
    calc: c => (c.freedomOfMovement) ? c.ukPopulationChangeOpen : c.ukPopulationChangeClosed
  },
  nonBritishNow: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: 'Now',
    minLabel: '',
    maxLabel: '',
    mergeInto: 'nonBritish2030',
  },
  nonBritishOpen: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "Freedom of movement with EU",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'nonBritish2030',
  },
  nonBritishClosed: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "No Freedom of movement with EU",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'nonBritish2030',
  },
  nonBritish2030: {
    title: 'Non-British population proportion',
    type: 'unitInterval',
    desc: 'Please estimate the % of non-British population from the total UK population now and in 2030 for two cases of migration policy.',
    calc: c => (c.freedomOfMovement) ? c.nonBritishOpen : c.nonBritishClosed
  },
  popChngDueImmgr: {
    title: 'Poulation change due to immigration',
    type: 'mirrorUnitInterval',
    desc: 'The % change in the total UK population in 2030 due to immigration.',
    /* X =
      = (nonBritishTotal2030 - nonBritishTotalNow) / allTotalNow
      = (nonBritish2030 * (1 + ukPopulationChange) * allTotalNow - nonBritishNow * allTotalNow) / allTotalNow
      = nonBritish2030 * (1 + ukPopulationChange) - nonBritishNow
    */
    calc: c => c.nonBritish2030 * (1 + c.ukPopulationChange) - c.nonBritishNow
  },
  britishIdentityRatio: {
    type: 'ratio',
    choice: true,
    mergeInto: 'britishIdentity',
  },
  britishIdentity: {
    title: 'Preservation of British identity',
    type: 'mirrorUnitInterval',
    desc: 'Please estimmate how much does the increase in non-british population % from the total affect preservation of British identity?',
    calc: c => c.britishIdentityRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  socialCohesionRatio: {
    type: 'ratio',
    choice: true,
    mergeInto: 'socialCohesion',
  },
  socialCohesion: {
    title: 'Social cohesion of the UK',
    type: 'mirrorUnitInterval',
    desc: 'Please estimmate how much does the increase in non-british population % from the total affect social cohesion of the UK?',
    calc: c => c.socialCohesionRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  unemploymentRatio: {
    type: 'ratio',
    choice: true,
    mergeInto: 'unemployment',
  },
  unemployment: {
    title: 'Unemployment rate',
    type: 'mirrorUnitInterval',
    desc: 'Please estimmate how much does the increase in non-british population % from the total affect the unemployment rate in the UK?',
    calc: c => c.unemploymentRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  medianIncomeRatio: {
    type: 'ratio',
    choice: true,
    mergeInto: 'medianIncome',
  },
  medianIncome: {
    title: 'Median income',
    type: 'mirrorUnitInterval',
    desc: 'Please estimmate how much does the increase in non-british population % from the total affect the median income in the UK?',
    calc: c => c.medianIncomeRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
}

const grid = `
  -                 -                  britishIdentity $britishIdentity
  -                 -                  socialCohesion  $socialCohesion
  freedomOfMovement nonBritish2030     medianIncome    $medianIncome
  -                 -                  unemployment    $unemployment
  -                 ukPopulationChange popChngDueImmgr -
`

export const movement = { factors, grid }
