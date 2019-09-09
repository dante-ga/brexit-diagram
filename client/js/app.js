import { getUserData, persist } from './persist.js'
import { getFactor } from './routes/factor.js'
import { getValues, activeAgent, importUserValues } from './routes/values.js'
import { getValue } from './routes/value.js'
import { getDiagram } from './routes/diagram.js'
import { getDecision, getDecisionToolbar, importStatus, startedEvauation } from './routes/decision.js'
import { NavBar, App, NotFound, Home, ToggleMode } from './components/app.js'
import { debounce } from './util.js'
import { importUserVals } from './calc/calc.js'
import Navigo from '../third_party/navigo.js'
import { getStats } from './stats.js'
import { updateComments } from './comments.js'
const { render } = lighterhtml

let activeRoute
let activeParams
let evaluating = false
const appEl = document.getElementById('App')

const toggleEvaluation = () => {
  evaluating = !evaluating
  updateView()
  persist('evaluating', evaluating)
}

const getNav = () => {
  const navTabs = []
  for (const route in routes) {
    const { navTab, navPath, path } = routes[route]
    if (navTab) {
      navTabs.push({
        title: navTab,
        active: route === activeRoute,
        href: navPath || path,
        onClick: (event) => navigate(navPath || path, event)
      })
    }
  }
  const toggleMode = ToggleMode(evaluating, toggleEvaluation)
  const goHome = (event) => navigate('/', event)
  return NavBar({ goHome, navTabs, toggleMode })
}

export function updateView() {
  render(appEl, () => {
    const { content, title } = routes[activeRoute].get(
      activeParams,
      { evaluating, updateView, navigate }
    )
    document.title = title + ' | Gitarg'
    const toolbar = (evaluating) ? getDecisionToolbar() : null
    return App(getNav(), content, toolbar)
  })
}

const router = new Navigo(window.location.origin)

export const navigate = (path, event) => {
  if (event) {
    if (event.ctrlKey) {
      return true
    } else {
      event.preventDefault()
    }
  }
  router.navigate(path)
  updateComments(routes[activeRoute])
  // window.scrollTo(0, 0)
}

//TODO: Fix activeAgent and add activeDiagram variables
const routes = {
  home: {
    get: () => ({
      content: Home(),
      title: 'Welcome!',
    }),
    path: '/',
  },
  diagram: {
    get: getDiagram,
    navTab: 'Influence Diagram',
    path: '/diagram/:subKey',
    navPath: '/diagram/brexit',
  },
  factor: {
    get: getFactor,
    path: '/factor/:key',
    comments: true,
  },
  factorActiveKey: {
    get: getFactor,
    path: '/factor/:key/:activeKey',
    comments: true,
  },
  values: {
    get: getValues,
    navTab: 'Values',
    path: '/values/:agent',
    navPath: '/values/' + activeAgent,
  },
  value: {
    get: getValue,
    path: '/value/:key/:agent',
    comments: true,
  },
  valueActiveOption: {
    get: getValue,
    path: '/value/:key/:agent/:activeOption',
    comments: true,
  },
  decision: {
    get: getDecision,
    navTab: 'Decision',
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
router.notFound(() => render(appEl, NotFound))

Promise.all([
  getUserData().then((data) => {
    importUserVals(data)
    importUserValues(data)
    importStatus(data)
    evaluating = !!data.evaluating
  }),
  getStats()
]).then(() => {
  router.resolve()
  updateComments(routes[activeRoute])
})
