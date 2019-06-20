export const ireland = {
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
  },
  violenceNiByOption: {
    type: 'MOTPE', 
    optionsFrom: 'irishBorder',
    mergeInto: 'violenceNi',
    choice: true,
  },
  violenceNi: {
    type: 'range',
    title: 'Violence in Northern Ireland',
    desc: "Violence in Northern Ireland is represented on the scale from the most peaceful region in the world (0) to the most violent (100). Please make an optimisic (O), pessimistic (P) and most likely (ML) estimates of violence under each of the following border arrangements.",
  },
  brokenDeal: {
    type: 'boolean',
    title: 'Irish border Brexit deal is broken',
    calc: c => (c.brexitApproval === 'deal') && (c.irishBorder === 'hardBorder'),
  },
}
