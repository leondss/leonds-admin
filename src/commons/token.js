const KEY = 'wkl'

function getToken () {
  return sessionStorage.getItem(KEY)
}

function setToken (token) {
  sessionStorage.setItem(KEY, token)
}

function removeToken () {
  sessionStorage.removeItem(KEY)
}

export { getToken, setToken, removeToken }
