import { Progress, Decision } from '../components/decision.js'
import { userVals } from '../calc/calc.js'
import { getMainDecision } from '../domain/domain.js'

const totalValues = 100

const countVals = () => Object.keys(userVals).length

export const getProgress = () => Progress(countVals(), totalValues)

export const getDecision = () => Decision(getMainDecision(userVals))
