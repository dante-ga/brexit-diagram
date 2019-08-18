import { Progress, Decision } from '../components/decision.js'
import { userVals } from '../calc/calc.js'
import { userValues } from '../calc/value.js'
import { domain, getMainDecision } from '../domain/domain.js'

const getValsTotalCount = () => {
  let count = 0
  for (const key in domain) {
    const { choice, decidedBy } = domain[key]
    if (choice && !decidedBy) count++
  }
  return count
}

const getValuesTotalCount = () => {
  let count = 0
  for (const agent in userValues) {
    count += Object.keys(userValues[agent]).length
  }
  return count
}
const totalCount = getValsTotalCount() + getValuesTotalCount()

const getCount = () => {
  const valCount = Object.keys(userVals).length
  let valueCount = 0
  for (const agent in userValues) {
    for (const valueKey in userValues[agent]) {
      if (userValues[agent][valueKey].touched) {
        valueCount++
      }
    }
  }
  return valCount + valueCount
}
export const getProgress = () => Progress(getCount(), totalCount)

export const getDecision = () => Decision(getMainDecision(userVals))
