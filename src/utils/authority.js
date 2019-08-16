
export function getAuthority() {
  return localStorage.getItem('user') || 'guest';
}

export function setAuthority(authority) {
  return localStorage.setItem('user', authority);
}
