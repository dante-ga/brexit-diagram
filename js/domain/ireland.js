const factors = {
  irishBorder: {
    type: 'option',
    title: 'Irish borders',
    desc: 'If UK leaves the EU, Irish border arrangements will need to be negotiated.',
    options: {
      hardBorder: 'Hard border',
      brokenBorder: 'EU-UK border broken in Ireland',
      seaBorder: 'Irish Sea border',
      unitedIreland: 'United Irland in the EU',
      openBorder: 'Open Irish border in the EU',
    },
    disableOptions: c => ((c.ukInEu)
      ? ['hardBorder', 'brokenBorder', 'seaBorder', 'unitedIreland']
      : ['openBorder']
    ),
    choice: true,
    calc: c => {
      if (c.ukInEu) {
        return 'openBorder'
      } else if (c.irishBorder === 'openBorder') {
        return 'brokenBorder'
      } else {
        return c.irishBorder
      }
    },
    valuedBy: ['Northern Ireland', 'UK', 'EU'],
    decidedBy: ['Northern Ireland', 'UK', 'EU'],
  },
  violenceNiByOption: {
    type: 'tpe',
    optionsFrom: 'irishBorder',
    mergeInto: 'violenceNi',
    choice: true,
  },
  violenceNi: {
    type: 'unitInterval',
    title: 'Violence in Northern Ireland',
    desc: "Please make an optimisic, pessimistic and most likely estimates of violence on a scale from 0% (no violence) to 100% (war) under each of the following border arrangements.",
    calc: c => {
      const {pessimistic, mostLikely, optimistic} = c.violenceNiByOption[c.irishBorder]
      const sample = new Random().triangular(optimistic, pessimistic, mostLikely)
      return sample
    },
    valuedBy: ['Northern Ireland', 'UK', 'EU'],
  },
  brokenDeal: {
    type: 'boolean',
    title: 'Irish border Brexit deal is broken',
    calc: c => (c.brexitApproval === 'deal') && (c.irishBorder === 'hardBorder'),
    valuedBy: ['Northern Ireland', 'UK', 'EU'],
  },
}

const grid = `
  -      brexitApproval brokenDeal   $brokenDeal
  ukInEu irishBorder    violenceNi   $violenceNi
  -      -              $irishBorder -
`

export const ireland = { factors, grid }
