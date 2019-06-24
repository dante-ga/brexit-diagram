export const security = {
  securityCoOp: {
    type: 'boolean',
    title: 'Full EU-UK cooperation to fight transnational crime',
    desc: 'Leaving the EU will prevent full cooperation between UK and EU security agencies.',
    valuedBy: ['UK', 'EU'],
    calc: c => c.ukInEu,
  },
}
