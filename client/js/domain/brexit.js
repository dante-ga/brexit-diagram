import { clone } from '../util.js'
import { calcSubs } from '../calc/calc.js'
import { getAgentValue } from '../calc/value.js'


//Starting Brexit event + miscaleneous factors
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
    blockedExtArrow: true,
    flipExtArrow: true,
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
    title: "UK's membership in the EU",
    desc: "Unless it remains in the EU, the UK will be effectively outside the EU immediately after no-deal Brexit or after the two year transition period as per the Brexit deal.",
    customCalc: true,
    calc: c => (c.brexitApproval === 'remain')
      || ((c.brexitApproval === 'deal') && (Math.random() < c.transitionPeriod)),
  },
  legalRights_remain: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After remaining in the EU",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'legalRights',
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
    desc: 'Please estimate the fullness of legal rights which UK sitiezens will have in the EU in the following cases.',
    type: 'unitInterval',
    calc: c => c['legalRights_' + c.brexitApproval],
    valuedBy: ['UK'],
  },
  researchColab_remain: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After remaining in the EU",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'researchColab',
  },
  researchColab_deal: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After leaving the EU with a deal",
    minLabel: '',
    maxLabel: '',
    mergeInto: 'researchColab',
  },
  researchColab_noDeal: {
    type: 'unitInterval',
    choice: true,
    sliderLabel: "After no-deal Brexit",
    minLabel: 'No collaboration',
    maxLabel: 'Full collaboration',
    mergeInto: 'researchColab',
  },
  researchColab: {
    title: 'Scientific research collaboration with the EU',
    desc: 'Please estimate how much scientific research collaboration with the EU will there  be in the following cases.',
    type: 'unitInterval',
    calc: c => c['researchColab_' + c.brexitApproval],
    valuedBy: ['UK'],
  },
  exchangeRateChangeIn: {
    type: 'mirrorUnitInterval',
    choice: true,
    mergeInto: 'exchangeRateChange',
    sliderLabel: "'Remain' change",
  },
  exchangeRateChangeOut: {
    type: 'mirrorUnitInterval',
    choice: true,
    mergeInto: 'exchangeRateChange',
    sliderLabel: "'Leave' change",
  },
  exchangeRateChange: {
    type: 'mirrorUnitInterval',
    title: 'GBP exchange rate change',
    desc: 'Please estimate the long term change of GBP exchange rate (eg. agians the USD) in the cases where the UK remains or leaves the EU.',
    calc: c => (c.ukInEu) ? c.exchangeRateChangeIn : c.exchangeRateChangeOut,
    valuedBy: ['UK']
  },
  securityCoOp: {
    type: 'boolean',
    title: 'Full EU-UK cooperation to fight transnational crime',
    desc: 'Leaving the EU will prevent full cooperation between UK and EU security agencies.',
    valuedBy: ['UK'],
    calc: c => c.ukInEu,
  },
  gibraltarInUkProb: {
    type: 'unitInterval',
    mergeInto: 'gibraltarInUk',
    choice: true,
    sliderLabel: 'Probability',
    minLabel: 'Impossible',
    maxLabel: 'Absolutely certain',
    arguments: {
      lower: ['Spain may force Gibraltar to leave the UK. Spain will have veto on all trade deals with Gibraltar in EU negotiatons.'],
      higher: ['2002 Gibraltar sovereignty referendum showed 99% oposition even towards a shared sovereignty with Spain.'],
    },
  },
  gibraltarInUk: {
    type: 'boolean',
    title: 'British sovereignty over Gibraltar',
    desc: 'What is the probability that Gibraltar will remain under British sovereignty until at least 2030 if the UK will leave the EU?',
    valuedBy: ['UK'],
    valueArguments: {
      UK: {
        lower: [],
        higher: ['"Gibraltar holds a strategically important position on the northern side of the strait separating Europe from Africa at the entrance to the Mediterranean Sea from the Atlantic."'],
      }
    },
    customCalc: true,
    calc: c => c.ukInEu || (Math.random() < c.gibraltarInUkProb),
  },
  noDealDisruptions: {
    type: 'boolean',
    title: 'Short term disruptions caused by no-deal',
    desc: 'Potential short term disruptions caused by no-deal Brexit.',
    valuedBy: ['UK'],
    calc: c => c.brexitApproval === 'noDeal'
  },
}

const diagram = `
  -                -             securityCoOp $securityCoOp
  transitionPeriod -             gibraltarInUk $gibraltarInUk
  -                ukInEu        exchangeRateChange $exchangeRateChange
  brexitApproval   -             legalRights   $legalRights
  -                -             researchColab $researchColab
  -                -             noDealDisruptions $noDealDisruptions
`

const getGibraltarValue = (vals) => {
  const subValue = ((vals.ukInEu) ? 1 : vals.gibraltarInUkProb)
    * getAgentValue('gibraltarInUk', true, 'UK')
  const subNodeValues = { gibraltarInUk: subValue }
  return { subValue, subNodeValues }
}

const getDecision = (vals, subdomains) => {
  const alternatives = {}
  const options = Object.keys(factors.brexitApproval.options)
  for (const option of options) {
    const context = clone(vals)
    context.brexitApproval = option
    context.ukInEu = (option === 'remain')
    let totalValue = 0
    const nodeValues = {}
    const valueGetters = ['scotland', 'ireland', 'negotiation']
      .map((sub) => subdomains[sub].getValue)
    valueGetters.push(getGibraltarValue)
    for (const getValue of valueGetters) {
      const { subValue, subNodeValues } = getValue(context, subdomains)
      totalValue += subValue
      Object.assign(nodeValues, subNodeValues)
    }
    const subs = ['brexit', 'influence', 'government']
    const { totalValues, subNodeValues } = calcSubs(context, subs)
    totalValue += totalValues.UK
    Object.assign(nodeValues, subNodeValues.UK)
    //TODO: Display nodeValues on the diagram
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

export const brexit = { factors, diagram, getDecision }
