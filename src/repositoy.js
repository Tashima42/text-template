export default function formsRepository() {
  return Object.freeze({
    getForms,
    saveForms,
  })
  function getForms() {
    return get('forms')
  }
  function saveForms(data) {
    set('forms', data)
  }
  function get(key) {
    return localStorage.getItem(key)
  }
  function set(key, data) {
    localStorage.setItem(key, data)
  }
}