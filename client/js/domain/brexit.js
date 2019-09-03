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

const diagram = `
  brexitApproval ukInEu
`

//TODO: display final values on value nodes

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
    const nodeValues = {}
    for (const sub of ['scotland', 'ireland', 'gibraltar', 'negotiation']) {
      const { subValue, subNodeValues } = subdomains[sub].getValue(context, subdomains)
      totalValue += subValue
      Object.assign(nodeValues, subNodeValues)
    }
    const subs = ['security', 'influence', 'government', 'rights', 'research', 'exchange']
    const { totalValues, subNodeValues } = calcSubs(context, subs)
    totalValue += totalValues.UK
    Object.assign(nodeValues, subNodeValues.UK)
    if (totalValue > maxTotalValue) {
      maxTotalValue = totalValue
      bestOption = option
    }
    //TODO: Display nodeValues on the diagram
    alternatives[option] = { totalValue, nodeValues }
  }
  return { bestOption, maxTotalValue, alternatives }
}

export const brexit = { factors, diagram, getDecision }
