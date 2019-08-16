import { Value } from './components/value.js'
import { domain } from './domain/domain.js'

export const getValue = ({ key }) => {
  const { title, valuedBy } = domain[key]
  return Value({title, valuedBy})
}
