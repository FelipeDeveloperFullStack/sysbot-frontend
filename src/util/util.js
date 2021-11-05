export const getLocalStorage = ({ key }) => {
  let result = localStorage.getItem(key)
  return JSON.parse(result)
}

export const setLocalStorage = ({ key, value }) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const deleteLocalStorage = ({ key }) => {
  localStorage.removeItem(key)
}