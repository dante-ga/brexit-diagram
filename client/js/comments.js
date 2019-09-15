import { Button } from './components/global.js'

let inited = false

const initComments = (config) => {
  var disqus_config = function () { config(this.page) };

  (function() {
  var d = document, s = d.createElement('script');
  s.src = 'https://gitarg.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
  })();

  inited = true
}

const commentsEl = document.getElementById('disqus_thread')

export const showComments = () => {
  commentsEl.style.display = 'block'
  const config = (page) => {
    page.identifier = window.location.pathname
    page.url = window.location.href
    page.title = document.title
  }
  if (inited) {
    DISQUS.reset({
      reload: true,
      config: function () { config(this.page) }
    })
  } else {
    initComments(config)
  }
}

export const hideComments = () => commentsEl.style.display = 'none'

const commentCounts = {}

const fetchCount = async (link, updateView) => {
  const url = new URL('https://disqus.com/api/3.0/threads/set.json')
  var params = {
    api_key: 'hLOQy5RhvPCF8znIj9cjIwDZW0izaDMoDBMhJl377q5tixKlIm9CbPpjbceY72BP',
    forum: 'gitarg',
    thread: 'link:' + link,
  }
  url.search = new URLSearchParams(params)
  const response = await fetch(url)
  const result = await response.json()
  let count
  if (result.response.length === 0) {
    count = 0
  } else {
    count = result.response[0].posts
  }
  if (commentCounts[link] !== count) {
    commentCounts[link] = count
    updateView()
  }
}

export const getCommentsButton = (updateView) => {
  let button
  if (!inited || (commentsEl.style.display === 'none')) {
    const link = window.location.href
    let label = 'Show comments'
    if (commentCounts.hasOwnProperty(link)) {
      label += ' (' + commentCounts[link] + ')'
    } else {
      fetchCount(link, updateView)
    }
    button =  Button({
      label,
      onClick: () => {
        showComments()
        updateView()
      },
    })
  } else {
    button =  Button({
      label: 'Hide comments',
      onClick: () => {
        hideComments()
        updateView()
      }
    })
  }
  return button
}
