import { bn } from '../util.js'

const euCostBefore = 17.4 * bn
const euIncomeBefore = (4.2 + 4.3 + 2.3) * bn

const factors = {
  euCost: {
    title: 'Contributions to the EU budget',
    type: 'gbp',
    desc: 'The ammount of money that the UK contributes early to the EU budget.',
    calc: c => (c.ukInEu) ? euCostBefore : 0
  },
  euIncome: {
    title: 'Inflow of funds from the EU budget',
    type: 'gbp',
    desc: 'The ammount of money that comes to the UK from the EU budget every year. £4.2bn rebate + £4.3 public sector receipts + £2.3bn private sector funding.',
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
    calc: c => c.euCost - c.euIncome
  },
  billIntention: {
    title: "Brexit divorce bill decision",
    type: 'boolean',
    checkboxLabel: 'UK intends to pay the Brexit divorce bill.',
    calc: c => (c.brexitApproval === 'deal') || ((c.brexitApproval === 'noDeal') && (c.billIntention)),
    decidedBy: ['UK'],
  },
  divorceBill: {
    title: "Brexit divorce bill",
    type: 'gbp',
    desc: "Sum of money due to the EU from the UK after Brexit to settle the UK's share of the financing of all the obligations undertaken while it was a member of the EU.",
    calc: c => (c.billIntention) ? 37.8 * bn : 0,
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
    desc: "UK government's yearly debt interest bill is £48 bn. 27% of the debt is owed to foreign institutions. Plase estimate how the interest payments will change if the UK will refuse to pay the divorce bill after Brexit.",
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
