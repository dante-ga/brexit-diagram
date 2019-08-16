import { getFactor } from './factor.js'
import { getValues } from './values.js'
import { getValue } from './value.js'
import { getDiagram } from './diagram.js'
import { getDecision, getProgress } from './decision.js'
import { NavBar, App, NotFound } from './components/app.js'
import { debounce } from './util.js'
import Navigo from '../third_party/navigo.js'
const { render } = lighterhtml

let activeRoute
let activeParams
//TODO: Import whole routes instead of get()?
const routes = {
  diagram: {
    get: getDiagram,
    navTab: 'Diagram',
    path: '/',
  },
  factor: {
    get: getFactor,
    path: '/factor/:key',
  },
  values: {
    get: getValues,
    navTab: 'Values',
    path: '/values',
  },
  value: {
    get: getValue,
    path: '/value/:key',
  },
  decision: {
    get: getDecision,
    navTab: 'Decision:',
    path: '/decision',
  },
}

const getNav = () => {
  const progress = getProgress()
  const navTabs = []
  for (const route in routes) {
    const { navTab, path } = routes[route]
    if (navTab) {
      navTabs.push({
        title: navTab,
        active: route === activeRoute,
        onClick: () => navigate(path)
      })
    }
  }
  const goHome = () => navigate('/')
  return NavBar({ goHome, navTabs, progress })
}

export function updateView() {
  render(document.body, () => {
    const content = routes[activeRoute].get(activeParams)
    return App(getNav(), content)
  })
}

const router = new Navigo('http://127.0.0.1:8887/')

export const navigate = (path) => {
  router.navigate(path)
  window.scrollTo(0, 0)
}

const routeHandlers = {}
for (const route in routes) {
  const { path } = routes[route]
  routeHandlers[path] = (params) => {
    activeRoute = route
    activeParams = params
    updateView()
  }
}
router.on(routeHandlers)
router.notFound(() => render(document.body, NotFound))
router.resolve()
