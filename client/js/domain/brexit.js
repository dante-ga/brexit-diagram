import { clone } from '../util.js'
import { calcSubs } from '../calc/calc.js'
import { getAgentValue } from '../calc/value.js'
import { getNegotiationDistribution } from '../calc/negotiation.js'


//Starting Brexit event + miscaleneous factors
const factors = {
  brexitApproval: {
    type: 'option',
    title: 'Brexit decision',
    desc: `
      The United Kingdom decides which Brexit option to take.
      <ul>
        <li><strong>Remain</strong> - cancel Brexit and stay in the EU</li>
        <li><strong>Deal</strong> - leave with the deal currently offered by the EU</li>
        <li><strong>No-deal</strong> - leave the EU without a deal</li>
      </ul>
    `,
    calcDesc: "Each of the options will be tried. The option resulting in the highest expected value for the United Kingdom will be chosen.",
    options: {
      remain: 'Remain',
      deal: 'Deal',
      noDeal: 'No-deal',
    },
    decidedBy: ['UK'],
    blockedExtArrow: true,
  },
  noDealDisruptions: {
    type: 'boolean',
    title: 'Short term disruptions',
    desc: 'Short term disruptions (UK border, supplies etc.) caused by Brexit',
    calcDesc: 'The disruptions will be present in case of a <a href="/factor/brexitApproval">no-deal Brexit</a> with no transition period.',
    valuedBy: ['UK'],
    calc: c => c.brexitApproval === 'noDeal'
  },
  marketMovement: {
    type: 'option',
    title: 'EU negotiation',
    desc: `
      Negotiations about UK's membership in:
      <ul>
        <li>EU's single market,</li>
        <li>EU's freedom of movement area.</li>
      </ul>
    `,
    calcDesc: `In case of the <a href="/factor/brexitApproval">remain Brexit decision</a> both memberships continue to be active. Otherwise all four combinations of membership statuses are considered. Each of the four options is evaluated and ranked by each of the agents (EU, UK) separately. A negotiation algorithm determnes probabilities of each of the outcomes according to the rankings. These probabilites are then used when calculating total expected values of this negotiation.`,
    options: {
      marketAndMovement: 'Single market and freedom of movement',
      onlyMarket: 'Only single market',
      onlyMovement: 'Only freedom of movement',
      noMarketNoMovement: 'No single market and no freedom of movement',
    },
    customCalc: true,
    calc: c => (c.brexitApproval === 'remain') ? 'marketAndMovement' : c.marketMovement,
    decidedBy: ['UK', 'EU'],
  },
  singleMarket: {
    type: 'boolean',
    title: 'Single market',
    desc: "The UK is in the single market with the EU.",
    calcDesc: `This is determined by the outcome of the <a href="/factor/marketMovement">EU negotiation</a>.`,
    customCalc: true,
    calc: c => ['marketAndMovement', 'onlyMarket'].includes(c.marketMovement),
  },
  freedomOfMovement: {
    type: 'boolean',
    title: 'Freedom of movement',
    desc: "There is freedom of movement between the UK and the EU.",
    calcDesc: `This is determined by the outcome of the <a href="/factor/marketMovement">EU negotiation</a>.`,
    customCalc: true,
    calc: c => ['marketAndMovement', 'onlyMovement'].includes(c.marketMovement),
  },
  transitionPeriod: {
    type: 'until2030interval',
    title: 'Transition period & backstop',
    desc: 'How long do you expect the transition period together with the backstop to last if the Brexit deal is approved?',
    choice: true,
    sliderLabel: 'Transition period & backstop duration',
    minLabel: '2020',
    maxLabel: '2030 (time horizon)',
    arguments: {
      lower: [
        'Both the EU and UK say the Irish backstop is intended to be temporary, and it would be if an alternative agreement was reached to take its place.',
        'Stephen Barclay, the Secretary of State for Exiting the EU, and Geoffrey Cox, the Attorney General, made a number of trips to Brussels to negotiate on the backstop, particularly around the UK’s ability to leave the arrangement if no alternatives are found. These negotiations culminated in a meeting between Prime Minister and President of the European Commission Jean-Claude Juncker in March 2019, when the two sides published further documents clarifying the provisions of the backstop. These turned the joint letters of January 2019 into a ‘joint legal instrument’ which reconfirmed both sides’ plan to work quickly for ‘alternative arrangements’ after the UK leaves the EU, to avoid the need for the backstop to ever come into force. The instrument also clarified that if the backstop comes into force, but the EU does not, "in good faith", use its "best endeavours" to negotiate an agreement to replace the backstop, then the UK can make use of the dispute settlement mechanism outlined in the Withdrawal Agreement.'
      ],
      higher: [
        'That advice, from Attorney General Geoffrey Cox, said “despite statements in the [backstop] protocol that it is not intended to be permanent, and the clear intention of the parties that it should be replaced by alternative permanent arrangements, in international law the protocol would endure indefinitely until a superseding agreement took its place”. In other words, while not intended to be permanent, it will only be temporary if the UK and EU find a mutually acceptable alternative.',
        'The Attorney General then published his legal assessment of what these new documents mean for the UK’s ability to leave the backstop. His conclusion was that while the new documents provide ‘useful clarifications’, nonetheless ‘the legal risk remains unchanged’ that the UK would have a legally-enforceable way to leave the backstop.'
      ],
    },
  },
  ukInEu: {
    type: 'boolean',
    title: "EU membership",
    desc: "Membership of the United Kindom in the European Union.",
    calcDesc: `In case of the remain <a href="/factor/brexitApproval">decision</a> the EU membership will continue. In case of a no-deal Brexit it will stop staight away. In case of the deal the membership will continue until the <a href="/factor/transitionPeriod">transition period & backstop</a> run out.`,
    customCalc: true,
    calc: c => (c.brexitApproval === 'remain')
      || ((c.brexitApproval === 'deal') && (Math.random() < c.transitionPeriod)),
  },
}

const diagram = `
  brexitApproval   -               noDealDisruptions $noDealDisruptions
  -                marketMovement  singleMarket
  -                -               freedomOfMovement
  transitionPeriod -               ukInEu
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
    const valueGetters = [
      subdomains.scotland.getValue,
      subdomains.ireland.getValue,
      subdomains.influence.getGibraltarValue,
      getNegotiationValue,
    ]
    for (const getValue of valueGetters) {
      const { subValue, subNodeValues } = getValue(context, subdomains)
      totalValue += subValue
      Object.assign(nodeValues, subNodeValues)
    }
    const subs = ['brexit', 'influence', 'government']
    const { totalValues, subNodeValues } = calcSubs(context, subs)
    totalValue += totalValues.UK
    Object.assign(nodeValues, subNodeValues.UK)
    const label = factors.brexitApproval.options[option]
    alternatives[option] = { totalValue, nodeValues, label  }
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
  return ({
    bestOption,
    maxTotalValue,
    alternatives,
  })
}

const getNegotiationValue = (vals, subdomains) => {
  const options = Object.keys(factors.marketMovement.options)
  if (vals.ukInEu) {
    const option = 'marketAndMovement'
    const { UK, nodeValues } = getNegotiationOptionValues(option, vals, subdomains)
    return { subValue: UK, subNodeValues: nodeValues }
  } else {
    const agentValues = { UK: {}, EU: {} }
    const optionValues = {}
    for (const option of options) {
      const { UK, EU, nodeValues } = getNegotiationOptionValues(option, vals, subdomains)
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

const getNegotiationOptionValues = (option, vals, subdomains) => {
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
    context.singleMarket = ['marketAndMovement', 'onlyMarket'].includes(option)
    context.freedomOfMovement = ['marketAndMovement', 'onlyMovement'].includes(option)
    context.billIntention = billIntention
    const subs = ['trade', 'immigration', 'budget', 'gdp', 'nhs']
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

export const brexit = { factors, diagram, getDecision }
