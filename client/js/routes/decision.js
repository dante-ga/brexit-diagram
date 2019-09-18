import { Info } from '../components/global.js'
import {
  Progress,
  ProgressPage,
  Decision,
  Next,
  Finish,
  DecisionInfo
} from '../components/decision.js'
import { userVals, hasChoiceMissing } from '../calc/calc.js'
import { userValues, hasMissingValues } from '../calc/value.js'
import { domain, getMainDecision, defaultAgent } from '../domain/domain.js'
import { navigate } from '../app.js'
import { persist } from '../persist.js'
import { round2tenth } from '../util.js'

const getValsTotalCount = () => {
  let count = 0
  for (const key in domain) {
    if (domain[key].choice) {
      count++
    }
  }
  return count
}

const getValuesTotalCount = () => {
  let count = 0
  for (const agent in userValues) {
    count += Object.keys(userValues[agent]).length
  }
  return count
}
const totalCount = getValsTotalCount() + getValuesTotalCount()

const getCount = () => {
  const valCount = Object.keys(userVals).length
  let valueCount = 0
  for (const agent in userValues) {
    for (const valueKey in userValues[agent]) {
      if (userValues[agent][valueKey].touched) {
        valueCount++
      }
    }
  }
  return valCount + valueCount
}

export const startedEvauation = () => {
  if (Object.keys(userVals).length > 0) {
    return true
  }
  for (const agent in userValues) {
    for (const valueKey in userValues[agent]) {
      if (userValues[agent][valueKey].touched) {
        return true
      }
    }
  }
  return false
}

let lastKey
const getMissingPath = () => {
  let skip = !!lastKey
  for (const key in domain) {
    skip = skip && (key != lastKey)
    if (skip) continue   //Skip touched keys to avoid re-computation
    const { mergeInto, valuedBy } = domain[key]
    if (mergeInto) continue
    if (hasChoiceMissing(key)) {
      lastKey = key
      return '/factor/' + key
    }
    if (valuedBy) {
      const {missing, agent} = hasMissingValues(key)
      if (missing) {
        lastKey = key
        return `/value/${key}/${agent}`
      }
    }
  }
  return null
}

export let complete = false

export const checkStatus = (data) => {
  const newComplete = getCount() === totalCount
  if (newComplete !== complete && (!data || (data.complete !== complete))) {
    persist('complete', newComplete)
    if (newComplete) {
      gtag('event', 'complete')
    }
  }
  complete = newComplete
}

export const getDecisionToolbar = () => {
  const progress = Progress(getCount(), totalCount)
  const nextPath = getMissingPath()
  let next
  if (nextPath) {
    let goNext, path
    if (nextPath !== window.location.pathname) {
      goNext = (event) => navigate(nextPath, event)
      path = nextPath
    }
    next = Next(goNext, path)
  } else {
    const decide = (event) => {
      complete = true
      navigate('/decision', event)
      persist('complete', true)
      gtag('event', 'complete')
    }
    next = Finish(decide, '/decision')
  }
  return [progress, next]
}

export const getDecision = (_, {updateView}) => {
  checkStatus()
  const content = []

  if (!localStorage.getItem('dismissed_decision_info')) {
    content.push(Info({
      title: 'Decision recommendation',
      content: DecisionInfo(),
      onClose: () => {
        localStorage.setItem('dismissed_decision_info', 'true')
        updateView()
      },
    }))
  }

  if (complete) {
    const decision = getMainDecision(userVals)
    const optionTotalValue = {}
    const optionLabels = []
    for (const option in decision.alternatives) {
      optionTotalValue[option] = 0
      optionLabels.push(decision.alternatives[option].label)
    }
    const valueRows = []
    for (const key in domain) {
      const { valuedBy, title } = domain[key]
      if (valuedBy && valuedBy.includes(defaultAgent)) {
        const row = [title]
        for (const option in decision.alternatives) {
          const { nodeValues } = decision.alternatives[option]
          const value = nodeValues[key]
          optionTotalValue[option] += value
          row.push(round2tenth(value))
        }
        valueRows.push(row)
      }
    }
    const totalValues = Object.values(optionTotalValue).map(Math.round)
    content.push(Decision({decision, valueRows, optionLabels, totalValues}))
  } else {
    content.push(ProgressPage(getCount(), totalCount))
  }
  return { content, title: 'Decision' }
}
