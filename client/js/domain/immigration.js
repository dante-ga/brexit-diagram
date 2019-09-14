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
    title: 'Population change due to immigration',
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
    sliderLabel: 'Impact ratio',
    choice: true,
    mergeInto: 'britishIdentity',
  },
  britishIdentity: {
    title: 'Preservation of British identity',
    type: 'mirrorUnitInterval',
    desc: 'Please estimmate how much does the increase in non-british population % from the total decrease preservation of British identity?',
    calc: c => - c.britishIdentityRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  socialCohesionRatio: {
    type: 'ratio',
    sliderLabel: 'Impact ratio',
    choice: true,
    mergeInto: 'socialCohesion',
  },
  socialCohesion: {
    title: 'Social cohesion of the UK',
    type: 'mirrorUnitInterval',
    desc: 'Please estimmate how much does the increase in non-british population % from the total decrease social cohesion of the UK?',
    calc: c => - c.socialCohesionRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  unemploymentRatio: {
    type: 'ratio',
    sliderLabel: 'Impact ratio',
    choice: true,
    mergeInto: 'unemployment',
  },
  unemployment: {
    title: 'Unemployment rate',
    type: 'mirrorUnitInterval',
    desc: 'Please estimmate how much does the increase in non-british population % from the total increase the unemployment rate in the UK?',
    calc: c => c.unemploymentRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
  },
  medianIncomeRatio: {
    type: 'ratio',
    sliderLabel: 'Impact ratio',
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
  securityCoOp: {
    type: 'boolean',
    title: 'Full EU-UK cooperation to fight transnational crime',
    desc: 'Leaving the EU will prevent full cooperation between UK and EU security agencies.',
    valuedBy: ['UK'],
    calc: c => c.ukInEu,
  },
}

const diagram = `
  -                 -                  britishIdentity $britishIdentity
  -                 -                  socialCohesion  $socialCohesion
  freedomOfMovement nonBritish2030     medianIncome    $medianIncome
  -                 -                  unemployment    $unemployment
  -                 ukPopulationChange popChngDueImmgr
  brexitApproval    -                  legalRights     $legalRights
  ukInEu            -                  securityCoOp    $securityCoOp
`

export const immigration = { factors, diagram }
