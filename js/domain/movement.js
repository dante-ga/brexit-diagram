export const movement = {
  ukPopulationChangeOpen: {
    type: 'change',
    choice: true,
    mergeInto: 'ukPopulationChange',
    change: { min: -0.5, max: 0.5, label: 'Freedom of movement with EU' , change: true }
  },
  ukPopulationChangeClosed: {
    type: 'change',
    choice: true,
    mergeInto: 'ukPopulationChange',
    change: { min: -0.5, max: 0.5, label: 'No freedom of movement with EU' , change: true }
  },
  ukPopulationChange: {
    title: 'Total UK population change',
    type: 'change',
    desc: 'Please estimate the % change of the total population of the UK in 2030 for two cases of migration policy.',
    calc: c => (c.freedomOfMovement) ? c.ukPopulationChangeOpen : c.ukPopulationChangeClosed
  },
  nonBritishNow: {
    type: 'probability',
    choice: true,
    probability: { min: '', max: '', label: "Now" },
    mergeInto: 'nonBritish2030',
  },
  nonBritishOpen: {
    type: 'probability',
    choice: true,
    probability: { min: '', max: '', label: "Freedom of movement with EU" },
    mergeInto: 'nonBritish2030',
  },
  nonBritishClosed: {
    type: 'probability',
    choice: true,
    probability: { min: '', max: '', label: "No Freedom of movement with EU" },
    mergeInto: 'nonBritish2030',
  },
  nonBritish2030: {
    title: 'Non-British population proportion',
    type: 'probability',
    desc: 'Please estimate the % of non-British population from the total UK population now and in 2030 for two cases of migration policy.',
    calc: c => (c.freedomOfMovement) ? c.nonBritishOpen : c.nonBritishClosed
  },
  populationChangeDueImmigration: {
    title: 'Poulation change due to immigration',
    type: 'change',
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
    ratio: { start: 0 },
    mergeInto: 'britishIdentity',
  },
  britishIdentity: {
    title: 'Preservation of British identity',
    type: 'change',
    desc: 'Please estimmate how much does the increase in non-british population % from the total affect preservation of British identity?',
    calc: c => c.britishIdentityRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  socialCohesionRatio: {
    type: 'ratio',
    choice: true,
    ratio: { start: 0 },
    mergeInto: 'socialCohesion',
  },
  socialCohesion: {
    title: 'Social cohesion of the UK',
    type: 'change',
    desc: 'Please estimmate how much does the increase in non-british population % from the total affect social cohesion of the UK?',
    calc: c => c.socialCohesionRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  unemploymentRatio: {
    type: 'ratio',
    choice: true,
    ratio: { start: 0 },
    mergeInto: 'unemployment',
  },
  unemployment: {
    title: 'Unemployment rate',
    type: 'change',
    desc: 'Please estimmate how much does the increase in non-british population % from the total affect the unemployment rate in the UK?',
    calc: c => c.unemploymentRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  medianIncomeRatio: {
    type: 'ratio',
    choice: true,
    ratio: { start: 0 },
    mergeInto: 'medianIncome',
  },
  medianIncome: {
    title: 'Median income',
    type: 'change',
    desc: 'Please estimmate how much does the increase in non-british population % from the total affect the median income in the UK?',
    calc: c => c.medianIncomeRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
}
