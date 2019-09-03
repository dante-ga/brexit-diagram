import { getUserData } from './persist.js'
import { getFactor } from './routes/factor.js'
import { getValues, activeAgent, importUserValues } from './routes/values.js'
import { getValue } from './routes/value.js'
import { getDiagram } from './routes/diagram.js'
import { getDecision, getDecisionToolbar, importStatus } from './routes/decision.js'
import { NavBar, App, NotFound } from './components/app.js'
import { debounce } from './util.js'
import { importUserVals } from './calc/calc.js'
import Navigo from '../third_party/navigo.js'
const { render } = lighterhtml

let activeRoute
let activeParams

const getNav = () => {
  const toolbar = getDecisionToolbar()
  const navTabs = []
  for (const route in routes) {
    const { navTab, navPath, path } = routes[route]
    if (navTab) {
      navTabs.push({
        title: navTab,
        active: route === activeRoute,
        onClick: () => navigate(navPath || path)
      })
    }
  }
  const goHome = () => navigate('/')
  return NavBar({ goHome, navTabs, toolbar })
}

export function updateView() {
  render(document.body, () => {
    const content = routes[activeRoute].get(activeParams)
    return App(getNav(), content)
  })
}

const router = new Navigo(window.location.origin)

export const navigate = (path) => {
  router.navigate(path)
  window.scrollTo(0, 0)
}

//TODO: Update page title on route change
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
    get: getValues({updateView, navigate}),
    navTab: 'Values',
    path: '/values/:agent',
    navPath: '/values/' + activeAgent,
  },
  value: {
    get: getValue,
    path: '/value/:key/:agent',
  },
  decision: {
    get: getDecision,
    navTab: 'Decision:',
    path: '/decision',
  },
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

getUserData().then((data) => {
  importUserVals(data)
  importUserValues(data)
  importStatus(data)
  updateView()
})
