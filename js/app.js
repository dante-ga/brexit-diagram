import { getFactors } from './factors/factors.js'
import { getFactorPage } from './factors/page.js'
import { getValues } from './values.js'
import { getGrid } from './grid.js'
import { calculate } from './calc.js'
import { NavBar, App } from './components/app.js'
import { debounce } from './util.js'
const { render } = lighterhtml

let activeScreen = 'grid'
let activeFactor = null
const getters = {
  grid: getGrid,
  factors: getFactors,
  values: getValues,
}
const screens = Object.keys(getters)

function onNav(target) {
  activeScreen = target
  activeFactor = null
  updateView()
}

export const activateFactor = (key) => {
  activeFactor = key
  activeScreen = null
  updateView()
}

export function updateView() {
  render(document.body, () => {
    const nav = NavBar({ activeScreen, screens, onNav })
    let content
    if (activeFactor) {
      content = getFactorPage(activeFactor)
    } else {
      content = getters[activeScreen]()
    }
    return App(nav, content)
  })
}

window.onresize = debounce(updateView, 100, true)

calculate()
updateView()
