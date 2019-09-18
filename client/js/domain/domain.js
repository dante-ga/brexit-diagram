export const subdomains = {}
const sub = obj => Object.assign(subdomains, obj)
import { brexit } from './brexit.js'; sub({brexit})
import { government } from './government.js'; sub({government})
import { influence } from './influence.js'; sub({influence})
import { scotland } from './scotland.js'; sub({scotland})
import { ireland } from './ireland.js'; sub({ireland})
import { trade } from './trade.js'; sub({trade})
import { immigration } from './immigration.js'; sub({immigration})
import { budget } from './budget.js'; sub({budget})
import { gdp } from './gdp.js'; sub({gdp})
import { nhs } from './nhs.js'; sub({nhs})

export const defaultAgent = 'UK'
export const agentLabels = {
  UK: 'United Kingdom',
  Scotland: 'Scotland',
  NI: 'Northern Ireland',
  EU: 'European Union',
}
export const subKeys = Object.keys(subdomains)
export const domain = {}

//Flatten subdomains into domain
for (const subKey in subdomains) {
  const { factors } = subdomains[subKey]
  for (const key in factors) {
    domain[key] = { key, subKey, ...factors[key], mergeFrom: [] }
  }
}

//Populate mergeFrom property
for (const source in domain) {
  const target = domain[source].mergeInto
  if (target) {
    domain[target].mergeFrom.push(source)
  }
}


export const getMainDecision = (vals) => subdomains.brexit.getDecision(vals, subdomains)
export const decisionOptionLabels = subdomains.brexit.decisionOptionLabels
