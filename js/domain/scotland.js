import { getAgentValue } from '../calc/value.js'

const factors = {
  scotlandApproval: {
    title: "Scottish independence intention",
    type: 'boolean',
    choice: true,
    checkboxLabel: 'Intends',
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
    desc: "If Scotland decides to become independent then with probability P it will become independent.",
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
    title: 'Scotland is a member of the EU',
    type: 'boolean',
    desc: "If Scotland will become independent then with probability P it will join the EU.",
    calc: c => c.independentScotland && (Math.random() < c.scotEuMemberProb)
  },
  scotlandInEu: {
    title: 'Scotland is in the EU',
    type: 'boolean',
    desc: "Scotland will be in the EU if it will become an EU member or if Scotland will remain in the UK which will remain in the EU.",
    valuedBy: ['Scotland'],
    calc: c => c.scotlandEuMember || (c.ukInEu && !c.independentScotland)
  },
}

const grid = `
  -                -                   $independentScotland -
  scotlandApproval independentScotland scotlandEuMember     scotlandInEu $scotlandInEu
  -                -                   ukInEu               -
`

//Note: due to complexity of generalization, values are calculated explicitly without reuse of 'calc' functions.
const getValue = (vals, values) => {
  const { ukInEu } = vals
  const scotlandApproval = getScotlandApproval({ukInEu}, vals, values)
  const value = getIndependentScotlandValueUK({scotlandApproval}, vals, values)
  return value
}

const getScotlandApproval = ({ukInEu}, vals, values) => {
  const valueTrue = getIndependentScotlandValue({ukInEu, scotlandApproval: true}, vals, values)
  const valueFalse = getIndependentScotlandValue({ukInEu, scotlandApproval: false}, vals, values)
  return valueTrue > valueFalse
}

const getIndependentScotlandValue = ({ukInEu, scotlandApproval}, vals, values) => {
  if (scotlandApproval) {
    const { indScotProb } = vals
    const value =
      getAgentValue('independentScotland', true, 'Scotland', values) * indScotProb
      + getScotlandEuMemberValue({ukInEu, independentScotland: true}, vals, values) * indScotProb
      + getScotlandEuMemberValue({ukInEu, independentScotland: false}, vals, values) * (1 - indScotProb)
    return value
  } else {
    return 0
  }
}

const getScotlandEuMemberValue = ({ukInEu, independentScotland}, vals, values) => {
  const { scotEuMemberProb } = vals
  const value = getScotlandInEuValue({ukInEu, independentScotland, scotlandEuMember: true}, vals, values) * scotEuMemberProb
    + getScotlandInEuValue({ukInEu, independentScotland, scotlandEuMember: false}, vals, values) * (1 - scotEuMemberProb)
  return value
}

const getScotlandInEuValue = ({ukInEu, independentScotland, scotlandEuMember}, vals, values) => {
  const scotlandInEu = scotlandEuMember || (ukInEu && independentScotland)
  const value = getAgentValue('scotlandInEu', scotlandInEu, 'Scotland', values)
  return value
}

const getIndependentScotlandValueUK = ({scotlandApproval}, vals, values) => {
  if (scotlandApproval) {
    const { indScotProb } = vals
    const value = getAgentValue('independentScotland', true, 'UK', values) * indScotProb
    return value
  } else {
    return 0
  }
}

export const scotland = { factors, grid, getValue }
