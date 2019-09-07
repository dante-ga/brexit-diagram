import { getNegotiationDistribution } from '../calc/negotiation.js'
import { calcSubs } from '../calc/calc.js'
import { clone } from '../util.js'

const factors = {
  marketMovement: {
    type: 'option',
    title: 'UK-EU negotiations',
    desc: 'UK-EU single market and freedom of movement combination',
    options: {
      marketAndMovement: 'Single market and freedom of movement',
      onlyMarket: 'Only single market',
      onlyMovement: 'Only freedom of movement',
      noMarketNoMovement: 'No single market and no freedom of movement',
    },
    choice: true,
    calc: c => (c.ukInEu) ? 'marketAndMovement' : c.marketMovement,
    decidedBy: ['UK', 'EU'],
  },
  singleMarket: {
    type: 'boolean',
    title: 'Single market',
    desc: "The UK is effectively in EU's single market.",
    calc: c => ['marketAndMovement', 'onlyMarket'].includes(c.marketMovement),
  },
  freedomOfMovement: {
    type: 'boolean',
    title: 'Freedom of movement',
    desc: "There is effectively freedom of movement between the UK and the EU.",
    calc: c => ['marketAndMovement', 'onlyMovement'].includes(c.marketMovement),
  },
  marketMovementTied: {
    type: 'boolean',
    title: 'Market tied to movement',
    desc: "The access to the single market and the freedom of movement across the EU are tied together.",
    calc: c => c.singleMarket === c.freedomOfMovement,
    valuedBy: ['EU'],
  }
}

const diagram = `
  -      -              singleMarket      -                  -
  ukInEu marketMovement -                 marketMovementTied $marketMovementTied
  -      -              freedomOfMovement -                  -
`

const options = Object.keys(factors.marketMovement.options)

const getValue = (vals, subdomains) => {
  if (vals.ukInEu) {
    const option = 'marketAndMovement'
    const { UK, nodeValues } = getOptionValues(option, vals, subdomains)
    return { subValue: UK, subNodeValues: nodeValues }
  } else {
    const agentValues = { UK: {}, EU: {} }
    const optionValues = {}
    for (const option of options) {
      const { UK, EU, nodeValues } = getOptionValues(option, vals, subdomains)
      agentValues.UK[option] = UK
      agentValues.EU[option] = EU
      optionValues[option] = nodeValues
    }
    const dist = getNegotiationDistribution(options, agentValues)
    let subValue = 0
    const subNodeValues = {}
    for (const option of options) {
      subValue += agentValues['UK'][option] * dist[option]
      for (const key in optionValues[option]) {
        subNodeValues[key] = (subNodeValues[key] || 0)
          + optionValues[option][key] * dist[option]
      }
    }
    return { subValue, subNodeValues }
  }
}

const getOptionValues = (option, vals, subdomains) => {
  vals.marketMovement = option
  let bestBI
  let maxUK = -Infinity
  let maxUKEU
  let maxNodeValues
  for (const billIntention of [false, true]) {
    //Filter out disabled bill/brexit combinations
    if (vals.brexitApproval === 'remain' && billIntention) continue
    const context = clone(vals)
    context.marketMovement = option
    context.billIntention = billIntention
    const subs = ['negotiation', 'trade', 'movement', 'bill', 'gdp', 'nhs']
    const {totalValues, subNodeValues} = calcSubs(context, subs)
    const {UK, EU} = totalValues
    if (UK > maxUK) {
      maxUK = UK
      maxUKEU = EU
      bestBI = billIntention
      maxNodeValues = subNodeValues.UK
    }
  }
  return { UK: maxUK, EU: maxUKEU, nodeValues: maxNodeValues }
}

export const negotiation = { factors, diagram, getValue }
