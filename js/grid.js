import { subdomains } from './domain/domain.js'

const parseFactorKeys = fn => fn.toString().match(/\Wc\.\w+/g).map(str => str.slice(3))

for (const subKey in subdomains) {
  const { factors, grid } = subdomains[subKey]
  for (const key in factors) {
    //TODO: CONTINUE HERE!
    //TODO: CONTINUE HERE!
    //TODO: CONTINUE HERE!
  }
}
