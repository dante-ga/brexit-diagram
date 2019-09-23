import { Tabs } from '../components/global.js'
import { Article } from '../components/about.js'

const topics = {
  project: { title: 'Project' },
  author: { title: 'Author' },
  algo: { title: 'Algorithms' },
  future: { title: 'Future plans' },
}

export const getAbout = ({ activeTopic }, {navigate}) => {
  const content = []
  const topicTabs = Object.keys(topics).map((topic) => ({
    label: topics[topic].title,
    active: topic === activeTopic,
    onClick: (event) => navigate('/about/'+topic, event),
    path: '/diagram/'+topic,
  }))
  content.push(Tabs(topicTabs))
  const { title } = topics[activeTopic]
  content.push(Article(activeTopic))
  return { content, title: 'About: '+title }
}
