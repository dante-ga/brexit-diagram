import { getNegotiationDistribution } from '../calc/negotiation.js'
import { getAgentValue } from '../calc/value.js'
import { clone } from '../util.js'

const factors = {}

factors.irishBorder = {
  type: 'option',
  title: 'Irish borders',
  desc: 'If UK leaves the EU, Irish border arrangements will need to be negotiated.',
  options: {
    hardBorder: 'Hard border',
    brokenBorder: 'EU-UK border broken in Ireland',
    seaBorder: 'Irish Sea border',
    unitedIreland: 'United Irland in the EU',
    openBorder: 'Open Irish border in the EU',
  },
  valueArguments: {
    NI: {
      hardBorder: {
        lower: ["Problems with trade with Ireland."],
        higher: [],
      },
      brokenBorder: {
        lower: [],
        higher: [],
      },
      seaBorder: {
        lower: ["Problems with trade with the rest of the UK."],
        higher: [],
      },
      unitedIreland: {
        lower: ["NI people don't support joining Ireland."],
        higher: ["No problems with trade with Ireland and the rest of the EU."],
      },
      openBorder: {
        lower: [],
        higher: ["No problems with trade."],
      },
    },
    UK: {
      hardBorder: {
        lower: [],
        higher: [],
      },
      brokenBorder: {
        lower: [],
        higher: [],
      },
      seaBorder: {
        lower: ["Partial loss of severenty over the NI."],
        higher: [],
      },
      unitedIreland: {
        lower: ["Complete loss of sovereignty over the NI. Breakdown of the Union."],
        higher: [],
      },
      openBorder: {
        lower: [],
        higher: [],
      },
    },
    EU: {
      hardBorder: {
        lower: [],
        higher: [],
      },
      brokenBorder: {
        lower: [],
        higher: [],
      },
      seaBorder: {
        lower: [],
        higher: [],
      },
      unitedIreland: {
        lower: [],
        higher: [],
      },
      openBorder: {
        lower: [],
        higher: [],
      },
    },
  },
  choice: true,
  calc: c => {
    if (c.ukInEu) {
      return 'openBorder'
    } else if (c.irishBorder === 'openBorder') {
      return 'brokenBorder'
    } else {
      return c.irishBorder
    }
  },
  valuedBy: ['NI', 'UK', 'EU'],
  decidedBy: ['NI', 'UK', 'EU'],
}

const violenceNiArguments = {
  hardBorder: {
    lower: [],
    higher: ['Irish unionist may violently oppose the split of the island re-starting "the Troubles".'],
  },
  brokenBorder: {
    lower: ['Unionists will not oppose this.'],
    higher: ['Broken border between EU and UK is an opportunity for criminal activity such as smuggling.'],
  },
  seaBorder: {
    lower: ['Unionists will favour this.'],
    higher: ['Irish unionists may decisde to take further action.'],
  },
  unitedIreland: {
    lower: ['The border will be completely errased.'],
    higher: ['People of NI may violently oppose this.'],
  },
  openBorder: {
    lower: ['Status quo is failrly peaceful.'],
    higher: [],
  },
}

const optionEntries = Object.entries(factors.irishBorder.options)
for (let i = 0; i < optionEntries.length; i++ ) {
  const [option, label] = optionEntries[i]
  const key = 'violenceNi_' + option
  factors[key] = {
    type: 'unitInterval',
    sliderLabel: label,
    mergeInto: 'violenceNi',
    choice: true,
    arguments: violenceNiArguments[option]
  }
  if (i === optionEntries.length - 1) {
    factors[key].minLabel = 'No violence'
    factors[key].maxLabel = 'War'
  }
}

factors.violenceNi = {
  type: 'unitInterval',
  title: 'Violence in Northern Ireland',
  desc: "What are expected levels of violence in Northern Ireland under each of the following border arrangements?",
  calc: c => c['violenceNi_' + c.irishBorder],
  valuedBy: ['NI', 'UK', 'EU'],
}

factors.brokenDeal = {
  type: 'boolean',
  title: 'Irish border Brexit deal is broken',
  calc: c => (c.brexitApproval === 'deal') && (c.irishBorder === 'hardBorder'),
  valuedBy: ['NI', 'UK', 'EU'],
}

const diagram = `
  -      brexitApproval brokenDeal   $brokenDeal
  ukInEu irishBorder    violenceNi   $violenceNi
  -      -              $irishBorder -
`

//Note: due to complexity of generalization are calculated explicitly without reuse of 'calc' functions.
const agents = factors.irishBorder.decidedBy
const options = Object.keys(factors.irishBorder.options).filter(opt => opt !== 'openBorder')

const getValue = (vals) => {
  const { ukInEu, brexitApproval } = vals
  let subValue = 0
  let subNodeValues = {}
  if (ukInEu) {
    const option = 'openBorder'
    subNodeValues = {
      violenceNi: getAgentValue('violenceNi', vals['violenceNi_' + option], 'UK'),
      irishBorder: getAgentValue('irishBorder', option, 'UK'),
    }
    subValue = subNodeValues.violenceNi + subNodeValues.irishBorder
  } else {
    const { agentValues, negotiationValues } = getBorderValues(vals)
    const borderDist = getNegotiationDistribution(options, negotiationValues)
    for (const option of options) {
      for (const key in agentValues['UK'][option]) {
        const value = agentValues['UK'][option][key] * borderDist[option]
        subNodeValues[key] = (subNodeValues[key] || 0) + value
        subValue += value
      }
    }
  }
  return { subValue, subNodeValues }
}

const getBorderValues = (vals) => {
  const { brexitApproval } = vals
  let agentValues = {}
  let negotiationValues = { }
  for (const agent of agents) {
    agentValues[agent] = {}
    negotiationValues[agent] = {}
    for (const option of options) {
      const brokenDeal = (brexitApproval === 'deal') && (option === 'hardBorder')
      agentValues[agent][option] = {
        brokenDeal: getAgentValue('brokenDeal', brokenDeal, agent),
        violenceNi: getAgentValue('violenceNi', vals['violenceNi_' + option], agent),
        irishBorder: getAgentValue('irishBorder', option, agent),
      }
      negotiationValues[agent][option] = Object.values(agentValues[agent][option])
        .reduce((a, b) => a + b, 0)
    }
  }
  return { agentValues, negotiationValues }
}

export const ireland = { factors, diagram, getValue }
