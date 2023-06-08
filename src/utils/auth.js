import Cookies from 'js-cookie'

const TokenKey = 'sep_admin_session'

export function getToken() {
  return Cookies.get(TokenKey)
	// return sessionStorage.getItem('sep_admin_session')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
	// return sessionStorage.setItem('sep_admin_session',token)
}

export function removeToken() {
	// return sessionStorage.removeItem('sep_admin_session')
  return Cookies.remove(TokenKey)
}
