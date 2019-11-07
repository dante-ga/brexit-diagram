import { Survey } from '../components/survey.js'
import { complete } from './decision.js'
import { saveSurvey } from '../persist.js'

let updateView

const questions = {
  like: {
    question: 'What do you like most about this website?',
    type: 'textarea'
  },
  dislike: {
    question: 'What would you like to change on the website?',
    type: 'textarea'
  },
  incomplete: {
    question: "Why didn't you answer all the Brexit Diagram questions (sliders)?",
    type: 'textarea'
  },
  recommendation: {
    question: 'What do you think of the Brexit decision recommendation provided by this website?',
    type: 'textarea',
  },
  share: {
    question: 'How likely are you to recommend this website to someone else?',
    type: 'probability',
  },
  topic: {
    question: "If I'm going to create another diagram, what should it be about?",
    type: 'text'
  },
  email: {
    question: 'Would you like to receive news about this project?',
    type: 'email',
    recieve: null,
    onClick: (recieve) => {
      questions.email.recieve = recieve
      updateView()
    }
  },
}

let submitting = false
let submitted = false

const onSubmit = () => {
  if (submitting) return false
  const data = {}
  let hasData = false
  for (const questionKey in questions) {
    const value = questions[questionKey].value
    if (value !== undefined) {
      hasData = true
      data[questionKey] = value
    }
  }
  if (hasData) {
    submitting = true
    updateView()
    saveSurvey(data).then(() => {
      submitting = false
      submitted = true
      updateView()
    })
  }
}

export const getSurvey = (_, { updateView: _updateView }) => {
  updateView = _updateView
  const questionArray = []
  for (const questionKey in questions) {
    if (complete) {
      if (questionKey === 'incomplete') continue
    } else {
      if (questionKey === 'recommendation') continue
    }
    const questionItem = Object.assign({}, questions[questionKey])
    questionItem.onChange = (e) => questions[questionKey].value = e.target.value
    questionArray.push(questionItem)
  }
  const q = Object.assign({}, questions)
  delete q[(complete) ? 'incomplete' : 'recommendation']
  return { content: Survey({questionArray, onSubmit, submitting, submitted}), title: 'Survey' }
}
