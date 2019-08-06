import { getInput, getTag } from './factors.js'
import { domain } from '../domain/domain.js'
import { calcVals } from '../calc/calc.js'
import { Title, Desc } from '../components/factors.js'

export const getFactorPage = (factorKey) => {
  const factor = []
  const domainFactor = domain[factorKey]
  const { key, title, type, desc, choice } = domainFactor
  const calcVal = calcVals[key]
  factor.push(Title(title, getTag(calcVal, type)))
  if (desc) factor.push(Desc(desc))
  if (choice) factor.push(getInput(domainFactor))
  for (const source of domainFactor.mergeFrom) {
    const ds = domain[source]
    if (ds.choice) factor.push(getInput(ds))
  }
  return factor
}
