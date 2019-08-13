import { clone } from '../util.js'
import { calcSubs } from '../calc/calc.js'

const factors = {
  brexitApproval: {
    type: 'option',
    title: 'UK Brexit decision',
    desc: 'UK picks the following Brexit option:',
    options: {
      remain: 'Remain',
      deal: 'Deal',
      noDeal: 'No-deal',
    },
    choice: true,
    decidedBy: ['UK'],
  },
  ukInEu: {
    type: 'boolean',
    title: "UK's membership in the EU",
    desc: "Unless it remains in the EU, the UK will be effectively outside the EU immediately after no-deal Brexit or after the two year transition period as per the Brexit deal.",
    calc: c => c.brexitApproval === 'remain',
  },
}

const grid = `
  brexitApproval ukInEu
`

const getDecision = (vals, subdomains) => {
  let bestOption
  let maxTotalValue = -Infinity
  const alternatives = {}
  const options = Object.keys(factors.brexitApproval.options)
  for (const option of options) {
    const context = clone(vals)
    context.brexitApproval = option
    context.ukInEu = (option === 'remain')
    let totalValue = 0
    for (const sub of ['scotland', 'ireland', 'gibraltar', 'negotiation']) {
      totalValue += subdomains[sub].getValue(context, subdomains)
    }
    const subs = ['security', 'influence', 'government', 'rights', 'research', 'exchange']
    totalValue += calcSubs(context, subs).UK
    if (totalValue > maxTotalValue) {
      maxTotalValue = totalValue
      bestOption = option
    }
    alternatives[option] = totalValue
  }
  return { bestOption, maxTotalValue, alternatives }
}

export const brexit = { factors, grid, getDecision }
