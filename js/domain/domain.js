const subdomains = {}
const sub = obj => Object.assign(subdomains, obj)
import { brexit } from './brexit.js'; sub({brexit})
import { scotland } from './scotland.js'; sub({scotland})
import { ireland } from './ireland.js'; sub({ireland})
import { gibraltar } from './gibraltar.js'; sub({gibraltar})
import { security } from './security.js'; sub({security})
import { influence } from './influence.js'; sub({influence})
import { government } from './government.js'; sub({government})
import { exchange } from './exchange.js'; sub({exchange})
import { negotiation } from './negotiation.js'; sub({negotiation})
import { trade } from './trade.js'; sub({trade})
import { movement } from './movement.js'; sub({movement})
import { rights } from './rights.js'; sub({rights})
import { research } from './research.js'; sub({research})
import { bill } from './bill.js'; sub({bill})
import { gdp } from './gdp.js'; sub({gdp})
import { gdppc } from './gdppc.js'; sub({gdppc})
import { nhs } from './nhs.js'; sub({nhs})

export const subKeys = Object.keys(subdomains)
export const domain = {}

//Flatten subdomains into domain
for (const subKey in subdomains) {
  const subdomain = subdomains[subKey]
  for (const key in subdomain) {
    domain[key] = { key, subKey, ...subdomain[key], mergeFrom: [] }
  }
}

for (const source in domain) {
  const target = domain[source].mergeInto
  if (target) {
    domain[target].mergeFrom.push(source)
  }
}
