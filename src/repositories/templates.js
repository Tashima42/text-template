export default function buildTemplatesRepository() {
  return Object.freeze({
    saveTemplateValuesDefault,
    saveTemplateValuesOld,
    getTemplateValuesDefault,
    getTemplateValuesOld,
    saveTemplateFileDefault,
    saveTemplateFileOld,
    getTemplateFileDefault,
    getTemplateFileOld,
    moveTemplateFile,
    saveSelectedTemplate,
    getSelectedTemplate,
    saveRoute,
    getRoute,
    getForms,
    saveForms,
  })
  function saveTemplateValuesDefault(values) {
    saveTemplateValues('default', values)
  }
  function saveTemplateValuesOld(values) {
    saveTemplateValues('old', values)
  }
  function saveTemplateValues(templateKey, values) {
    const key = `template-values-${templateKey}`
    set(key, JSON.stringify(values))
  }
  function getTemplateValuesDefault() {
    return getTemplateValues('default')
  }
  function getTemplateValuesOld() {
    return getTemplateValues('old')
  }
  function getTemplateValues(templateKey) {
    const key = `template-values-${templateKey}`
    return get(key)
  }
  function saveTemplateFileDefault(file) {
    saveTemplateFile('default', file)
  }
  function saveTemplateFileOld(file) {
    saveTemplateFile('old', file)
  }
  function saveTemplateFile(templateKey, file) {
    const key = `template-file-${templateKey}`
    if (typeof file === 'string') {
      set(key, file)
    } else {
      set(key, JSON.stringify(file))
    }
  }
  function getTemplateFileDefault() {
    return getTemplateFile('default')
  }
  function getTemplateFileOld() {
    return getTemplateFile('old')
  }
  function getTemplateFile(templateKey) {
    const key = `template-file-${templateKey}`
    return get(key)
  }
  function moveTemplateFile(templateKey) {
    const key = `template-file-used-${templateKey}`
    set(key, JSON.stringify(getTemplateFile(templateKey)))
    remove(templateKey)
  }
  function saveSelectedTemplate(templateKey) {
    set('selected-template', templateKey)
  }
  function getSelectedTemplate() {
    return get('selected-template')
  }
  function saveRoute(route) {
    set('route', route)
  }
  function getRoute() {
    return get('route')
  }
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
  function remove(key) {
    localStorage.removeItem(key)
  }
}