import { getFactors } from './factors/factors.js'
import { getFactorPage } from './factors/page.js'
import { getValues } from './values.js'
import { getGrid } from './grid.js'
import { calculate } from './calc/calc.js'
import { NavBar, App } from './components/app.js'
import { debounce } from './util.js'
const { render } = lighterhtml

let gridScrollY = 0
let activeScreen = 'grid'
let activeFactor = null
const getters = {
  grid: getGrid,
  values: getValues,
  factors: getFactors,
}
const screens = Object.keys(getters)

function onNav(target) {
  if (activeScreen === 'grid') gridScrollY = window.scrollY
  activeScreen = target
  activeFactor = null
  updateView()
  if (activeScreen === 'grid') window.scrollTo(0, gridScrollY);
}

export const activateFactor = (key) => {
  if (activeScreen === 'grid') gridScrollY = window.scrollY
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
