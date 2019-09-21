import { Tabs } from '../components/global.js'
import { Article } from '../components/about.js'

const topics = {
  project: { title: 'This project' },
  author: { title: 'Author' },
  algorithms: { title: 'Algorithms' },
  future: { title: 'Future Plans' },
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
  content.push(Article(title))
  return { content, title: 'About: '+title }
}
