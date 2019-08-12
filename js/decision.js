import { Decision } from './components/decision.js'
import { calcVals } from './calc/calc.js'

export const getDecision = () => Decision(calcVals.mainDecision)
