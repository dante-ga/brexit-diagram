import { uuidv4 } from './util.js'

const apiHost = 'https://api.gitarg.org'
const uid = Cookies.get('uid') || uuidv4()
Cookies.set('uid', uid, { expires: 15/*days*/ })

const post = (path, data) => fetch( apiHost + path, {
  method: 'POST',
  body: JSON.stringify(data),
})

export const persist = (key, val) => {
  const data = { uid }
  data[key] = val
  post('/updateUser', data)
}

export const bulkPersist = (data) => {
  data.uid = uid
  post('/updateUser', data)
}

export const getUserData = async () => {
  const response = await post('/getUser', { uid })
  const userData = await response.json()
  return userData
}
