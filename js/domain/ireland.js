import { getNegotiationDistribution } from '../calc/negotiation.js'
import { getAgentValue } from '../calc/value.js'

const factors = {
  irishBorder: {
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
  },
  violenceNiByOption: {
    type: 'tpe',
    optionsFrom: 'irishBorder',
    mergeInto: 'violenceNi',
    choice: true,
  },
  violenceNi: {
    type: 'unitInterval',
    title: 'Violence in Northern Ireland',
    desc: "Please make an optimisic, pessimistic and most likely estimates of violence on a scale from 0% (no violence) to 100% (war) under each of the following border arrangements.",
    calc: c => tpeExpected(c.violenceNiByOption[c.irishBorder]),
    valuedBy: ['NI', 'UK', 'EU'],
  },
  brokenDeal: {
    type: 'boolean',
    title: 'Irish border Brexit deal is broken',
    calc: c => (c.brexitApproval === 'deal') && (c.irishBorder === 'hardBorder'),
    valuedBy: ['NI', 'UK', 'EU'],
  },
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
  const { ukInEu, brexitApproval, violenceNiByOption } = vals
  let value = 0
  if (ukInEu) {
    value = getAgentValue('violenceNi', tpeExpected(violenceNiByOption['openBorder']), 'UK')
  } else {
    const agentValues = getBorderValues(vals)
    const borderDist = getNegotiationDistribution(options, agentValues)
    for (const option of options) {
      value += agentValues['UK'][option] * borderDist[option]
    }
  }
  return value
}

const getBorderValues = (vals) => {
  const { brexitApproval, violenceNiByOption } = vals
  let agentValues = {}
  for (const agent of agents) {
    agentValues[agent] = {}
    for (const option of options) {
      const brokenDeal = (brexitApproval === 'deal') && (option === 'hardBorder')
      const value = getAgentValue('brokenDeal', brokenDeal, agent)
        + getAgentValue('violenceNi', tpeExpected(violenceNiByOption[option]), agent)
        + getAgentValue('irishBorder', option, agent)
      agentValues[agent][option] = value
    }
  }
  return agentValues
}

const tpeExpected = ({pessimistic, mostLikely, optimistic}) =>
  (pessimistic + 4 * mostLikely + optimistic) / 6

export const ireland = { factors, diagram, getValue }
