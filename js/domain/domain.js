import { brexit } from './brexit.js'
import { scotland } from './scotland.js'
import { ireland } from './ireland.js'
import { gibraltar } from './gibraltar.js'
import { government } from './government.js'

export const domain = {
  ...brexit,
  ...scotland,
  ...ireland,
  ...gibraltar,
  ...government,
}

for (const factorKey in domain) {
  domain[factorKey].key = factorKey
}

export const mergeFrom = {}

for (const source in domain) {
  const target = domain[source].mergeInto
  if (target) {
    mergeFrom[target] = source
  }
}
