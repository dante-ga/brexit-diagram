import { outLink } from '../components/global.js'

const factors = {
  ukLawsForced: {
    type: 'boolean',
    title: 'Laws imposed by the EU',
    desc: 'EU regulations apply directly at the UK national level. This means that when a regulation is approved at the EU level it applies immediately without the need for legislation by the UK government.',
    calcDesc: `The EU will impose laws in the UK if its <a href="/factor/ukInEu">EU membership</a> will continue.`,
    calc: c => c.ukInEu,
    valuedBy: ['UK'],
    valueArguments: { UK: {
      lower: [`In agriculture, fisheries, external trade, and the environment, it’s fair to say that EU legislation and policy is indeed the main driver of UK law and policy, although the UK retains some freedom of action in these areas.<br>${outLink('UK law: What proportion is influenced by the EU?', 'https://fullfact.org/europe/uk-law-what-proportion-influenced-eu/')}`],
      higher: [
        `UK Environmental Law Association considers that EU environmental policy and legislation has, on balance, had a significant and very positive influence on the environment in the UK, with related economic benefits.<br>${outLink("Impact of EU membership on UK's environmental laws", 'https://www.ukela.org/impacteulaw')}`
      ],
    }},
  },
  rejectedReferendum: {
    type: 'boolean',
    title: 'Referendum results rejected',
    desc: 'The situation when the results of the 2016 UK referendum on the subject of EU membership (52% "leave" to 48% "remain") does not come into force.',
    calcDesc: `Referendum results will be rejected if the UK will continue being an <a href="/factor/ukInEu">EU member</a>.`,
    calc: c => c.ukInEu,
    valuedBy: ['UK'],
  },
  ukLawsForcedImpact: {
    type: 'mirrorUnitInterval',
    choice: true,
    mergeInto: 'govtEffectiveness',
    sliderLabel: 'Laws imposed by the EU',
  },
  rejectedReferendumImpact: {
    type: 'minusUnitInterval',
    choice: true,
    mergeInto: 'govtEffectiveness',
    sliderLabel: "Loss of public trust due to rejection of referendum results",
    minLabel: 'Complete shutdown',
    maxLabel: 'No impact',

  },
  govtEffectiveness: {
    type: 'unitInterval',
    title: 'UK Government effectiveness',
    question: "What impact can EU laws and rejection of the referendum results have on the effectiveness of the UK government?",
    desc: `Scale: <strong>-100%</strong> = complete shutdown; <strong>0%</strong> = no impact; <strong>+100%</strong> = the effectiness doubles.`,
    calcDesc: `If a facor exists, its impact is added to the total impact on the government effectiveness.`,
    //Relative change value. Not an absolute figure.
    calc: c => ((c.ukLawsForced) ? c.ukLawsForcedImpact : 0)
      + ((c.rejectedReferendum) ? c.rejectedReferendumImpact : 0),
    valuedBy: ['UK'],
  }
}

const diagram = `
  -      ukLawsForced       $ukLawsForced
  ukInEu -                  govtEffectiveness   $govtEffectiveness
  -      rejectedReferendum $rejectedReferendum
`

export const government = { factors, diagram }
