import { getFactors } from './factors/factors.js'
import { getValues } from './values.js'
import { NavBar, App } from './components/app.js'
import { debounce } from './util.js'
const { render } = lighterhtml

let activeScreen = 'factors'
const getters = {
  factors: getFactors,
  values: getValues,
}
const screens = Object.keys(getters)

function onNav(target) {
  activeScreen = target
  updateView()
}

//lighterhtml seems to re-render everything now
export function updateView() {
  render(document.body, () => {
    const nav = NavBar({ activeScreen, screens, onNav })
    const content = getters[activeScreen]()
    return App(nav, content)
  })
}

updateView()
window.onresize = debounce(updateView, 100, true)
