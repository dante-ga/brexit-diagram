import { getFactors } from './factors/factors.js'
import { getValues } from './values.js'
import { getGrid } from './grid.js'
import { calculate } from './calc.js'
import { NavBar, App } from './components/app.js'
import { debounce } from './util.js'
const { render } = lighterhtml

let activeScreen = 'grid'
const getters = {
  factors: getFactors,
  values: getValues,
  grid: getGrid,
}
const screens = Object.keys(getters)

function onNav(target) {
  activeScreen = target
  updateView()
}

export function updateView() {
  render(document.body, () => {
    const nav = NavBar({ activeScreen, screens, onNav })
    const content = getters[activeScreen]()
    return App(nav, content)
  })
}

window.onresize = debounce(updateView, 100, true)

calculate()
updateView()
