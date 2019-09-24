import { bn } from '../util.js'
import { outLink } from '../components/global.js'
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

const factors = {
  movement2householdConsumption: {
    type: 'ratio',
    sliderLabel: 'Impact ratio',
    choice: true,
    mergeInto: 'consumptionChange',
  },
  consumptionChange: {
    title: 'Household consumption',
    type: 'mirrorUnitInterval',
    question: 'What is the ratio between the increase in the total UK population due to immigration and increase of the total UK household consumption that it causes?',
    desc: `Scale: <strong>0</strong> = no spending at all; <strong>1</strong> = same average spending per person as the rest of the population; <strong>2</strong> = double the spending of a native person.`,
    calc: c => c.popChngDueImmgr * c.movement2householdConsumption,
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
    title: 'Invesment',
    question: "How much more or less will the UK businesses be spending money on investment in the following cases?",
    type: 'mirrorUnitInterval',
    calc: c => c['investmentChange_' + c.brexitApproval],
  },
  govtSpendingChange: {
    type: 'mirrorUnitInterval',
    title: 'Government spending',
    desc: 'Change in the total UK government spending until 2030.',
    calcDesc: `Government spending in 2016-2017 was £772bn (${outLink('source', "https://www.gov.uk/government/publications/budget-2016-documents/budget-2016")}). Government spending after Brexit will be affected by  changes to <a href="/factor/euNetCost">UK's net contributions to the EU budget</a> and <a href="/factor/debtService">foreign debt service payments</a> as well as the <a href="/factor/divorceBill">Brexit divorce bill</a>.`,
    calc: c => {
      const billBefore = (c.debtServiceBefore + c.euNetCostBefore) * by2030
      const billNow = (c.debtService + c.euNetCost) * by2030 + c.divorceBill
      const totalBefore = 772 * bn
      const change = - (billNow - billBefore) / totalBefore
      return change
    },
    valuedBy: ['UK'],
    flipExtArrow: true,
  },
  exportsChange: {
    title: 'Exports',
    desc: 'Changes to the total UK exports.',
    calcDesc: `This is a sum of changes in <a href="/factor/exportsToEu">EU</a> and <a href="/factor/exportsToNonEu">non-EU exports</a>.`,
    type: 'mirrorUnitInterval',
    calc: c => {
      const totalChange = exportsToEuBefore * c.exportsToEu + exportsToNonEuBefore * c.exportsToNonEu
      return totalChange / totalExportsBefore
    }
  },
  importsChange: {
    title: 'Imports',
    desc: 'Changes to the total UK imports.',
    calcDesc: `This is a sum of changes in <a href="/factor/importsFromEu">imports from EU</a> and <a href="/factor/importsFromNonEu">non-EU countries</a>.`,
    type: 'mirrorUnitInterval',
    calc: c => {
      const totalChange = importsFromEuBefore * c.importsFromEu + importsFromNonEuBefore * c.importsFromNonEu
      return totalChange / totalImportsBefore
    }
  },
  gdpChange: {
    title: 'GDP',
    type: 'mirrorUnitInterval',
    desc: 'Change to the gross domestic product of the United Kingdom.',
    calcDesc: `GDP =
      <a href="/factor/consumptionChange">household consumption</a> +
      <a href="/factor/govtSpendingChange">government spending</a> +
      <a href="/factor/investmentChange">investment</a> + (
        <a href="/factor/exportsChange">exports</a> -
        <a href="/factor/importsChange">imports</a>
      ).
      The changes are combined according to the 2017 sizes of the parts of the UK GDP. Source: ${outLink("United Kingdom economic indicators", "https://www.theglobaleconomy.com/United-Kingdom/")}
    `,
    valuedBy: ['UK'],
    calc: c => C_GDP * c.consumptionChange
      + I_GDP * c.investmentChange
      + G_GDP * c.govtSpendingChange
      + X_GDP * c.exportsChange
      + M_GDP * c.importsChange
  },
  gdppcChange: {
    title: 'GDP per person',
    type: 'mirrorUnitInterval',
    desc: 'Change to the gross domestic product of the United Kingdom per person.',
    calcDesc: 'It is determined by the ratio of <a href="/factor/gdpChange">GDP growth</a> and <a href="/factor/ukPopulationChange">population growth</a>.',
    valuedBy: ['UK'],
    /* X =
      = gdppcNew/gdppcOld - 1
      = (gdpNew/popNew)/(gdpOld/popOld) - 1
      = (gdpNew/gdpOld)/(popNew/popOld) - 1
      = (1 + c.gdpChange)/(1 + c.ukPopulationChange) - 1
    */
    calc: c => (1 + c.gdpChange)/(1 + c.ukPopulationChange) - 1,
  },
}

const diagram = `
  euNetCost        -
  divorceBill      govtSpendingChange $govtSpendingChange
  debtService      -
  popChngDueImmgr  consumptionChange
  brexitApproval   investmentChange   gdpChange           $gdpChange
  exportsToEu      exportsChange      -                   gdppcChange $gdppcChange
  exportsToNonEu   -                  ukPopulationChange
  importsFromEu    importsChange
  importsFromNonEu -
`

export const gdp = { factors, diagram }
