import { bn } from '../util.js'
import { outLink } from '../components/global.js'

const euCostBefore = 17.4 * bn
const euIncomeBefore = (4.2 + 4.3 + 2.3) * bn

const factors = {
  euCost: {
    title: 'Contributions to the EU budget',
    type: 'gbp',
    desc: 'The ammount of money that the UK contributes early to the EU budget.',
    calcDesc: `The UK's EU membership fee before rebate was £17.4bn in 2018. Source: ${outLink("The UK's EU membership fee - Full Fact", "https://fullfact.org/europe/our-eu-membership-fee-55-million/")}`,
    calc: c => (c.ukInEu) ? euCostBefore : 0
  },
  euIncome: {
    title: 'Inflow of funds from the EU budget',
    type: 'gbp',
    desc: 'The ammount of money that comes to the UK from the EU budget every year.',
    calcDesc: `Inflow = £4.2bn rebate + £4.3 public sector receipts + £2.3bn private sector funding. Source: ${outLink("The UK's EU membership fee - Full Fact", "https://fullfact.org/europe/our-eu-membership-fee-55-million/")}`,
    calc: c => (c.ukInEu) ? euIncomeBefore : 0
  },
  euNetCostBefore: {
    type: 'gbp',
    mergeInto: 'euNetCost',
    calc: c => euCostBefore - euIncomeBefore
  },
  euNetCost: {
    title: "UK's net contributions to the EU budget",
    type: 'gbp',
    desc: 'The difference between how much the UK pays to the EU budget and how much it gains back from it.',
    calcDesc: `Net contributions = <a href="/factor/euCost">£17.4bn contributions</a> - <a href="/factor/euIncome">£10.8bn inflow</a> = £6.6bn.`,
    calc: c => c.euCost - c.euIncome
  },
  billIntention: {
    title: "Brexit divorce bill decision",
    type: 'boolean',
    desc: 'The United Kingdom decides if it should pay the Brexit divorce bill to the European Union.',
    calcDesc: `It is subject to the <a href="/factor/brexitApproval">Brexit decision</a>. If the UK will remain in the EU, no bill is required. If the Brexit deal will be legislated, the UK agrees to pay the bill. In the case of a no-deal brexit each of the options will be tried. The option resulting in the highest expected value for the United Kingdom will be chosen.`,
    calc: c => (c.brexitApproval === 'deal') || ((c.brexitApproval === 'noDeal') && (c.billIntention)),
    decidedBy: ['UK'],
  },
  divorceBill: {
    title: "Brexit divorce bill",
    type: 'gbp',
    desc: "Sum of money due to the EU from the UK after Brexit to settle the UK's share of the financing of all the obligations undertaken while it was a member of the EU.",
    calcDesc: `The latest estimate for the size of the UK’s ‘divorce bill’ upon leaving the EU is £32.8bn. Source: ${outLink('Office for Budget Responsibility', "https://obr.uk/docs/dlm_uploads/Fiscalrisksreport2019.pdf#page=172")}`,
    calc: c => (c.billIntention) ? 32.8 * bn : 0,
  },
  debtServiceChange: {
    type: 'mirrorUnitInterval',
    choice: true,
    mergeInto: 'debtService',
    sliderLabel: 'Change after divorce bill refusal',
  },
  debtServiceBefore: {
    //https://fullfact.org/economy/does-government-spend-50-billion-debt-interest-payments/
    //https://fullfact.org/economy/guide-economy-debt/
    type: 'gbp',
    mergeInto: 'debtService',
    calc: () => 48 * bn * 0.27,
  },
  debtService: {
    title: 'Yearly foreign debt service payments',
    type: 'gbp',
    question: 'How much will the interest payments change if the UK will refuse to pay the divorce bill after Brexit?',
    calcDesc: `UK government's yearly debt interest bill is £48bn (${outLink('source', "https://fullfact.org/economy/does-government-spend-50-billion-debt-interest-payments/")}). 27% of the debt is owed to foreign institutions (${outLink('source', "https://fullfact.org/economy/guide-economy-debt/")}). Debt service payments corresponding to that proportion will change according to the above slider if the divorce bill will not be paid after a no-deal Brexit.`,
    calc: c => c.debtServiceBefore * (1 +((!c.billIntention && c.brexitApproval !== 'remain') ? c.debtServiceChange : 0))
  }
}

const diagram = `
  -              euIncome      -
  ukInEu         euCost        euNetCost
  brexitApproval billIntention divorceBill
  -              -             debtService
`

export const budget = { factors, diagram }
