import { TOKEN_NAME } from './contants'

function getToken () {
  return sessionStorage.getItem(TOKEN_NAME)
}

function setToken (token) {
  sessionStorage.setItem(TOKEN_NAME, token)
}

function removeToken () {
  sessionStorage.removeItem(TOKEN_NAME)
}

export { getToken, setToken, removeToken }
