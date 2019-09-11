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

export const updateComments = ({ comments }, evaluating) => {
  const commentsEl = document.getElementById('disqus_thread')
  if (comments && !evaluating) {
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
  } else {
    commentsEl.style.display = 'none'
  }
}
