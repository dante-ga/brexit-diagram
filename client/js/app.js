import { getUserData, persist } from './persist.js'
import { getFactor } from './routes/factor.js'
import { getValues, activeAgent, importUserValues } from './routes/values.js'
import { getValue } from './routes/value.js'
import { getDiagram } from './routes/diagram.js'
import {
  getDecision,
  getDecisionToolbar,
  startedEvauation,
  checkStatus,
  complete
} from './routes/decision.js'
import { NavBar, App, NotFound } from './components/app.js'
import { debounce } from './util.js'
import { importUserVals } from './calc/calc.js'
import Navigo from '../third_party/navigo.js'
import { getStats } from './stats.js'
import { hideComments, showComments } from './comments.js'
const { render } = lighterhtml

let activeRoute
let activeParams
let evaluating = true
const appEl = document.getElementById('App')

const setEvaluation = (newEval) => {
  evaluating = newEval
  updateView()
}

const getNav = () => {
  const navTabs = []
  const navTabsEnd = []
  for (const route in routes) {
    const { navTab, navEnd, navPath, path } = routes[route]
    if (navTab) {
      const tab = {
        title: navTab,
        active: route === activeRoute,
        href: navPath || path,
        onClick: (event) => navigate(navPath || path, event)
      }
      ;(navEnd) ? navTabsEnd.push(tab) : navTabs.push(tab)
    }
  }
  return NavBar({ navTabs, navTabsEnd })
}

export function updateView() {
  render(appEl, () => {
    const { content, title } = routes[activeRoute].get(
      activeParams,
      { evaluating, setEvaluation, updateView, navigate }
    )
    document.title = title + ' | Gitarg'
    let toolbar
    if (complete) {
      document.body.classList.remove('has-navbar-fixed-bottom')
    } else {
      toolbar = getDecisionToolbar()
      document.body.classList.add('has-navbar-fixed-bottom')
    }
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
}

//Intercept content link clicks
appEl.addEventListener('click', (event) => {
  const path = event.target.pathname
  if (path && event.target.closest('.navbar') === null) {
    navigate(path, event)
  }
})

//TODO: Fix activeAgent and add activeDiagram variables
const routes = {
  diagram: {
    get: getDiagram,
    navTab: 'Diagram',
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
  about: {
    get: () => ({content: '...', title: 'About' }),
    navTab: 'About',
    navEnd: true,
    path: '/about',
  },
  discussion: {
    get: () => {
      showComments()
      return {content: '', title: 'Discussion' }
    },
    navTab: 'Discussion 💬',
    navEnd: true,
    path: '/discussion',
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
router.hooks({
  before: (done) => {
    evaluating = true
    hideComments()
    done()
  },
  after: () => {
    gtag('config', 'UA-147529439-1', { 'page_path': window.location.pathname })
  }
})
router.notFound(() => render(appEl, NotFound))

Promise.all([
  getUserData().then((data) => {
    importUserVals(data)
    importUserValues(data)
    checkStatus()
  }),
  getStats()
]).then(() => router.resolve())
