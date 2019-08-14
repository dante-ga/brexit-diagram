export const factors = {
  securityCoOp: {
    type: 'boolean',
    title: 'Full EU-UK cooperation to fight transnational crime',
    desc: 'Leaving the EU will prevent full cooperation between UK and EU security agencies.',
    valuedBy: ['UK'],
    calc: c => c.ukInEu,
  },
}

const diagram = `
  ukInEu securityCoOp $securityCoOp
`

export const security = { factors, diagram }
