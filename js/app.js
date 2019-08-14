import { getFactor } from './factor.js'
import { getValues } from './values.js'
import { getDiagram } from './diagram.js'
import { getDecision, getProgress } from './decision.js'
import { NavBar, App } from './components/app.js'
import { debounce } from './util.js'
import Navigo from '../third_party/navigo.js'
const { render } = lighterhtml

let diagramScrollY = 0
let activeScreen = 'diagram'
let activeFactor = null
const screens = {
  diagram: {
    get: getDiagram,
    title: 'Diagram',
  },
  values: {
    get: getValues,
    title: 'Values',
  },
  decision: {
    get: getDecision,
    title: 'Decision:',
  }
}

function onNav(target) {
  if (activeScreen === 'diagram') diagramScrollY = window.scrollY
  activeScreen = target
  activeFactor = null
  updateView()
  if (activeScreen === 'diagram') window.scrollTo(0, diagramScrollY);
}

const activateFactor = (key) => {
  if (activeScreen === 'diagram') diagramScrollY = window.scrollY
  activeFactor = key
  activeScreen = null
  updateView()
}

export function updateView() {
  render(document.body, () => {
    const progress = getProgress()
    const nav = NavBar({ activeScreen, screens, navigate, progress })
    let content
    if (activeFactor) {
      content = getFactor(activeFactor)
    } else {
      content = screens[activeScreen].get()
    }
    return App(nav, content)
  })
}

window.onresize = debounce(updateView, 100, true)

const router = new Navigo('http://127.0.0.1:8887/')
export const navigate = (path) => router.navigate(path)

router
  .on(() => onNav('diagram'))
  .on({
    '/diagram': function() { onNav('diagram') },
    '/values': function() { onNav('values') },
    '/decision': function() { onNav('decision') },
    '/factor/:key': function({key}) { activateFactor(key) },
  })
  .resolve()
