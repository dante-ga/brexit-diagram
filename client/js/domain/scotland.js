import { getAgentValue } from '../calc/value.js'

const factors = {
  scotlandApproval: {
    title: "Scottish indep. decision",
    type: 'boolean',
    desc: 'Scotland decides if it should try to leave the UK and become independent.',
    calcDesc: "Each of the options will be tried. The option resulting in the highest expected value for Scotland will be chosen.",
    decidedBy: ['Scotland'],
  },
  indScotProb: {
    type: 'unitInterval',
    mergeInto: 'independentScotland',
    choice: true,
    sliderLabel: 'Probability P',
    minLabel: 'Impossible',
    maxLabel: 'Absolutely certain',
  },
  independentScotland: {
    title: 'Scottish independence',
    type: 'boolean',
    question: "What is the probability that Scotland will become independent (e.g. despite legal obstacles and UK's wishes) if it will decide to try.",
    valuedBy: ['UK', 'Scotland'],
    calc: c => c.scotlandApproval && (Math.random() < c.indScotProb)
  },
  scotEuMemberProb: {
    type: 'unitInterval',
    mergeInto: 'scotlandEuMember',
    choice: true,
    sliderLabel: 'Probability P',
    minLabel: 'Impossible',
    maxLabel: 'Absolutely certain',
  },
  scotlandEuMember: {
    title: 'Scottish membership in the EU',
    type: 'boolean',
    question: "What is the probability of Scotland being able to join the EU after becoming independent.",
    calc: c => c.independentScotland && (Math.random() < c.scotEuMemberProb)
  },
  scotlandInEu: {
    title: 'Presence of Scotland in the EU',
    type: 'boolean',
    calcDesc: "Scotland will be present in the EU if it will become an EU member or if Scotland will remain in the UK which in turn will remain in the EU.",
    valuedBy: ['Scotland'],
    calc: c => c.scotlandEuMember || (c.ukInEu && !c.independentScotland)
  },
}

const diagram = `
  -                -                    ukInEu               -
  scotlandApproval independentScotland  $independentScotland scotlandInEu $scotlandInEu
  -                -                    scotlandEuMember
`

//Note: due to complexity of generalization are calculated explicitly without reuse of 'calc' functions.
const getValue = (vals) => {
  const { ukInEu } = vals
  const scotlandApproval = getScotlandApproval({ukInEu}, vals)
  const { value: subValue, nodeValues: subNodeValues } = getIndependentScotlandValueUK({scotlandApproval}, vals)
  return { subValue, subNodeValues }
}

const getScotlandApproval = ({ukInEu}, vals) => {
  const valueTrue = getIndependentScotlandValue({ukInEu, scotlandApproval: true}, vals)
  const valueFalse = getIndependentScotlandValue({ukInEu, scotlandApproval: false}, vals)
  return valueTrue > valueFalse
}

const getIndependentScotlandValue = ({ukInEu, scotlandApproval}, vals) => {
  if (scotlandApproval) {
    const { indScotProb } = vals
    const value =
      getAgentValue('independentScotland', true, 'Scotland') * indScotProb
      + getScotlandEuMemberValue({ukInEu, independentScotland: true}, vals) * indScotProb
      + getScotlandEuMemberValue({ukInEu, independentScotland: false}, vals) * (1 - indScotProb)
    return value
  } else {
    return 0
  }
}

const getScotlandEuMemberValue = ({ukInEu, independentScotland}, vals) => {
  const { scotEuMemberProb } = vals
  const value = getScotlandInEuValue({ukInEu, independentScotland, scotlandEuMember: true}, vals) * scotEuMemberProb
    + getScotlandInEuValue({ukInEu, independentScotland, scotlandEuMember: false}, vals) * (1 - scotEuMemberProb)
  return value
}

const getScotlandInEuValue = ({ukInEu, independentScotland, scotlandEuMember}, vals) => {
  const scotlandInEu = scotlandEuMember || (ukInEu && independentScotland)
  const value = getAgentValue('scotlandInEu', scotlandInEu, 'Scotland')
  return value
}

const getIndependentScotlandValueUK = ({scotlandApproval}, vals) => {
  if (scotlandApproval) {
    const { indScotProb } = vals
    const value = getAgentValue('independentScotland', true, 'UK') * indScotProb
    const nodeValues = { independentScotland: value }
    return { value, nodeValues }
  } else {
    return { value: 0, nodeValues: {independentScotland: 0}}
  }
}

export const scotland = { factors, diagram, getValue }
