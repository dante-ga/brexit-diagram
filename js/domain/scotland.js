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

//Note: due to complexity of generalization are calculated explicitly without reuse of 'calc' functions.
const getValue = (vals) => {
  const { ukInEu } = vals
  const scotlandApproval = getScotlandApproval({ukInEu}, vals)
  const value = getIndependentScotlandValueUK({scotlandApproval}, vals)
  return value
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
    return value
  } else {
    return 0
  }
}

export const scotland = { factors, grid, getValue }
