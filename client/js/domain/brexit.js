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
    sliderLabel: 'Probability P',
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
    desc: 'If the UK will leave the EU, Gibraltar will remain under British sovereignty with probability P (in the next 25 years).',
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
}

const diagram = `
  -                -             securityCoOp $securityCoOp
  transitionPeriod -             gibraltarInUk $gibraltarInUk
  -                ukInEu        exchangeRateChange $exchangeRateChange
  brexitApproval   -             legalRights   $legalRights
  -                -             researchColab $researchColab
`
//CONTINE HERE!!!
//CONTINE HERE!!!
//CONTINE HERE!!!
//CONTINE HERE!!!
//CONTINE HERE!!!
//CONTINE HERE!!!
//TODO: Fix calculations from former miscaleneous moduels

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
