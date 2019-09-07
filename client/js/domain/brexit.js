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
  transitionPeriod: {
    type: 'until2030interval',
    title: 'Transition period & backstop',
    desc: 'If the deal is approved how many years do you expect the transition period and the backstop to last?',
    choice: true,
    sliderLabel: 'Transition period & backstop duration',
    minLabel: '2020',
    maxLabel: '2030 (time horizon)',
  },
  ukInEu: {
    type: 'boolean',
    title: "UK's membership in the EU",
    desc: "Unless it remains in the EU, the UK will be effectively outside the EU immediately after no-deal Brexit or after the two year transition period as per the Brexit deal.",
    calc: c => (c.brexitApproval === 'remain')
      || ((c.brexitApproval === 'deal') && (Math.random() < c.transitionPeriod)),
  },
}

const diagram = `
  brexitApproval
  transitionPeriod ukInEu
`

const getDecision = (vals, subdomains) => {
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
    //TODO: Display nodeValues on the diagram
    alternatives[option] = { totalValue, nodeValues }
  }


  //Apply transition between "remain" and "deal" states
  const {deal, remain} = alternatives
  const trp = vals.transitionPeriod
  for (const k in deal.nodeValues) {
    deal.nodeValues[k] = remain.nodeValues[k] * trp + deal.nodeValues[k] * (1 - trp)
  }
  deal.totalValue = remain.totalValue * trp + deal.totalValue * (1 - trp)

  let bestOption
  let maxTotalValue = -Infinity
  for (const option of options) {
    const { totalValue } = alternatives[option]
    if (totalValue > maxTotalValue) {
      maxTotalValue = totalValue
      bestOption = option
    }
  }
  return { bestOption, maxTotalValue, alternatives }
}

export const brexit = { factors, diagram, getDecision }
