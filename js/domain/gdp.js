import { bn } from '../util.js'
const by2030 = 10


//https://researchbriefings.parliament.uk/ResearchBriefing/Summary/CBP-7851
const exportsToEuBefore = 274 * bn
const importsFromEuBefore = 341 * bn
const euExp = 0.44
const euImp = 0.53
const exportsToNonEuBefore = (exportsToEuBefore / euExp) * (1 - euExp)
const totalExportsBefore = exportsToEuBefore + exportsToNonEuBefore
const importsFromNonEuBefore = (importsFromEuBefore / euImp) * (1 - euImp)
const totalImportsBefore = importsFromEuBefore + importsFromNonEuBefore

//https://www.theglobaleconomy.com/United-Kingdom/household_consumption/
const C_GDP = 0.6572
//https://www.theglobaleconomy.com/United-Kingdom/Capital_investment/
const I_GDP = 0.1724
//https://www.theglobaleconomy.com/United-Kingdom/Government_size/
const G_GDP = 0.1841
//https://www.theglobaleconomy.com/United-Kingdom/Exports/
const X_GDP = 0.3053
//https://www.theglobaleconomy.com/United-Kingdom/Imports/
const M_GDP = -0.3193

export const gdp = {
  movement2householdConsumption: {
    type: 'ratio',
    choice: true,
    mergeInto: 'householdConsumptionChange',
  },
  householdConsumptionChange: {
    title: 'Change in total UK household consumption',
    type: 'mirrorUnitInterval',
    desc: "How much does the % increase in the total UK population due to immigration cause % increase of the total UK household consumption.",
    calc: c => c.populationChangeDueImmigration * c.movement2householdConsumption,
  },
  investmentChange_remain: {
    type: 'mirrorUnitInterval',
    mergeInto: 'investmentChange',
    choice: true,
    sliderLabel: "After remaining in the EU",
    minLabel: '',
    maxLabel: '',
  },
  investmentChange_deal: {
    type: 'mirrorUnitInterval',
    mergeInto: 'investmentChange',
    choice: true,
    sliderLabel: "After leaving the EU with a deal",
    minLabel: '',
    maxLabel: '',
  },
  investmentChange_noDeal: {
    type: 'mirrorUnitInterval',
    mergeInto: 'investmentChange',
    choice: true,
    sliderLabel: "After no-deal Brexit",
    minLabel: 'Decrease',
    maxLabel: 'Increase',
  },
  investmentChange: {
    title: 'Change in the total UK invesment',
    desc: "How much more or less will the UK businesses spend money on investment in the following cases.",
    type: 'mirrorUnitInterval',
    calc: c => c['investmentChange_' + c.brexitApproval],
  },
  govtSpendingChange: {
    type: 'mirrorUnitInterval',
    title: 'Change in total government spending',
    desc: "Government spending will be affected by UK's net contributions to the EU budget, Brexit divorce bill and changes to the foreign debt service payments.",
    calc: c => {
      const billBefore = (c.debtServiceBefore + c.euNetCost) * by2030
      const billNow = (c.debtService + ((c.ukInEu) ? c.euNetCost : 0)) * by2030 + ((c.billIntention) ? c.divorceBill : 0)
      const totalBefore = 772 * bn
      const change = - (billNow - billBefore) / totalBefore
      return change
    },
  },
  exportsChange: {
    title: 'Change in total UK exports',
    desc: 'This combines changes in EU and non-EU exports.',
    type: 'mirrorUnitInterval',
    calc: c => {
      const totalChange = exportsToEuBefore * c.exportsToEu + exportsToNonEuBefore * c.exportsToNonEu
      return totalChange / totalExportsBefore
    }
  },
  importsChange: {
    title: 'Change in total UK imports',
    desc: 'This combines changes in EU and non-EU imports.',
    type: 'mirrorUnitInterval',
    calc: c => {
      const totalChange = importsFromEuBefore * c.importsFromEu + importsFromNonEuBefore * c.importsFromNonEu
      return totalChange / totalImportsBefore
    }
  },
  gdpChange: {
    title: 'Change in total UK GDP',
    type: 'mirrorUnitInterval',
    desc: 'This combines changes in consumption, govt. spending, investment, imports and exports.',
    valuedBy: ['UK'],
    calc: c => C_GDP * c.householdConsumptionChange
      + I_GDP * c.investmentChange
      + G_GDP * c.govtSpendingChange
      + X_GDP * c.exportsChange
      + M_GDP * c.importsChange
  }
}
