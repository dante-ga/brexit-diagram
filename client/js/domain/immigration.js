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
    title: 'Total UK population',
    type: 'mirrorUnitInterval',
    question: "How much will the total UK population change if the UK will remain/leave the EU's freedom of movement area?",
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
    sliderLabel: "Freedom of movement with the EU",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'nonBritish2030',
  },
  nonBritishClosed: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "No freedom of movement with the EU",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'nonBritish2030',
  },
  nonBritish2030: {
    title: 'Non-British population proportion',
    type: 'unitInterval',
    question: "What percentage of the UK population is now non-British? What will it be in 2030 if the UK remains/leaves EU's freedom of movement area?",
    calc: c => (c.freedomOfMovement) ? c.nonBritishOpen : c.nonBritishClosed
  },
  popChngDueImmgr: {
    title: 'Population growth due to immigration',
    type: 'mirrorUnitInterval',
    desc: 'The percentage change in the total UK population by 2030 due to immigration.',
    calcDesc: `"population growth due to immigration" = ("total non-British population in 2030" - "total non-Brtish population now") / "total UK population now"`,
    /* CALCULATIONS
      popChngDueImmgr =
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
    question: 'What is the ratio between the increase in non-British population and decrease in preservation of British identity that it causes?',
    desc: `Scale: <strong>0</strong> = no impact; <strong>1</strong> = proportinal impact (i.e. an increase in non-British population by 1% causes decrease in British identity by 1%); <strong>2</strong> = double impact.`,
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
    question: 'What is the ratio between the increase in non-British population and decrease in social cohesion of the UK that it causes?',
    desc: `Scale: <strong>0</strong> = no impact; <strong>1</strong> = proportinal impact (i.e. an increase in non-British population by 1% causes decrease social cohesion by 1%); <strong>2</strong> = double impact.`,
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
    question: 'What is the ratio between the increase in non-British population and increase in unemployment rate that it causes?',
    desc: `Scale: <strong>0</strong> = no impact; <strong>1</strong> = proportinal impact (i.e. an increase in non-British population by 1% causes increase in unemployment rate by 1%); <strong>2</strong> = double impact.`,
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
    question: 'What is the ratio between the increase in non-British population and decrease in median income that it causes?',
    desc: `Scale: <strong>0</strong> = no impact; <strong>1</strong> = proportinal impact (i.e. an increase in non-British population by 1% causes decrease in median income by 1%); <strong>2</strong> = double impact.`,
    calc: c => c.medianIncomeRatio * (c.nonBritish2030 - c.nonBritishNow),
    valuedBy: ['UK'],
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
    question: 'How much of the legal rights will the UK citizens maintain in the EU if the UK leaves with/without a deal?',
    desc: `Scale: <strong>0%</strong> = all of the rights will be lost; <strong>100%</strong> = all of the right will remain.`,
    type: 'unitInterval',
    calc: c => (c.brexitApproval === 'remain') ? 1 : c['legalRights_' + c.brexitApproval],
    valuedBy: ['UK'],
  },
  securityCoOp_deal: {
    type: 'mirrorUnitInterval',
    choice: true,
    sliderLabel: "After leaving the EU with a deal",
    mergeInto: 'securityCoOp',
  },
  securityCoOp_noDeal: {
    type: 'mirrorUnitInterval',
    choice: true,
    sliderLabel: "After no-deal Brexit",
    mergeInto: 'securityCoOp',
  },
  securityCoOp: {
    type: 'mirrorUnitInterval',
    title: 'Transnational crime',
    question: 'How much will the level of transnational crime affecting the UK change if the UK leaves with/without a deal?',
    desc: `Scale: <strong>-100%</strong> = it will stop completely; <strong>0%</strong> = it will remain the same; <strong>+100%</strong> = it will double.`,
    valuedBy: ['UK'],
    calc: c => (c.brexitApproval === 'remain') ? 1 : c['securityCoOp_' + c.brexitApproval],
  },
}

const diagram = `
  -                 -                  britishIdentity $britishIdentity
  -                 -                  socialCohesion  $socialCohesion
  freedomOfMovement nonBritish2030     medianIncome    $medianIncome
  -                 -                  unemployment    $unemployment
  -                 ukPopulationChange popChngDueImmgr
  -                 brexitApproval     legalRights     $legalRights
  -                 -                  securityCoOp    $securityCoOp
`

export const immigration = { factors, diagram }
