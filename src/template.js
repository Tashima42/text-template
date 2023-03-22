import consts from './consts.js'
import errors from './errors.js'

/**
 * @class Template
 * Class to handle the template config file
 */
export class Template {
  configString;
  config;
  templates;

  /**
   * @param {String} configString 
   */
  constructor(configString) {
    this.configString = configString
  }

  /**
   * Parse the config file string and save the templates names 
   * @returns {Object} { success: Boolean, message: String }
   */
  parse() {
    // Try to parse the config file string
    try {
      this.config = JSON.parse(this.configString)
    } catch (error) {
      return { success: false, message: 'Não foi possível ler o arquivo de configuração.', error: errors.failedToJSONParse }
    }
    // Verify the config file version
    if (this.config.version != consts.templateConfigVersion) {
      return { success: false, message: `Versão da configuração é '${this.config.version}', a versão esperada era '${consts.templateConfigVersion}', essa configuração pode não funcionar.`, error: errors.mismatchedConfigVersion }
    }
    // Get the template names and save
    this._hidrateTemplates()
    // validate all templates
    this.templates.forEach(templateKey => {
      const template = this.config.templates[templateKey]
      const validation = this._validateTemplateTypes(template)
      if (!validation.success) {
        return validation
      }
    })
    return { success: true, message: "Configuração carregada com sucesso.", error: false }
  }
  _hidrateTemplates() {
    this.templates = Object.keys(this.config.templates)
  }
  _validateTemplateTypes(template) {
    template.options.forEach(option => {
      switch (option.type) {
        case "select":
          return this._validateOptionSelect(option)
        case "input":
          return this._validateOptionInput(option)
        case "multi-select":
          return this._validateOptionMultiSelect(option)
        case "autocomplete":
          return this._validateOptionAutocomplete(option)
        default:
          return { success: false, message: `O tipo ${option.type} não é um tipo válido.` }
      }
    })
    return { success: true, message: "Opções válidas.", error: false }
  }
  _validateOptionSelect(option) {
    if (option.type !== "select") {
      return { success: false, message: `O tipo ${option.type} não é um tipo válido para essa opção.`, error: errors.invalidOption }
    }
    if (!option.label || typeof option.label !== "string") {
      return { success: false, message: `A opção ${option.label} não tem um label válido.`, error: errors.invalidOption }
    }
    if (!option.values || !Array.isArray(option.values)) {
      return { success: false, message: `A opção ${option.label} não tem um array de valores válido.`, error: errors.invalidOption }
    }
    if (!option.values.length) {
      return { success: false, message: `A opção ${option.label} não tem valores válidos.`, error: errors.invalidOption }
    }
    if (!option.values.every(value => typeof value === "string")) {
      return { success: false, message: `A opção ${option.label} não tem valores válidos.`, error: errors.invalidOption }
    }
    return { success: true, message: "Opção válida.", error: false }
  }
  _validateOptionInput(option) {
    if (option.type !== "input") {
      return { success: false, message: `O tipo ${option.type} não é um tipo válido para essa opção.`, error: errors.invalidOption }
    }
    if (!option.label || typeof option.label !== "string") {
      return { success: false, message: `A opção ${option.label} não tem um label válido.`, error: errors.invalidOption }
    }
    return { success: true, message: "Opção válida.", error: false }
  }
  _validateOptionMultiSelect(option) {
    if (option.type !== "multi-select") {
      return { success: false, message: `O tipo ${option.type} não é um tipo válido para essa opção.`, error: errors.invalidOption }
    }
    if (!option.label || typeof option.label !== "string") {
      return { success: false, message: `A opção ${option.label} não tem um label válido.`, error: errors.invalidOption }
    }
    if (!option.values || !Array.isArray(option.values)) {
      return { success: false, message: `A opção ${option.label} não tem um array de valores válido.`, error: errors.invalidOption }
    }
    if (!option.values.length) {
      return { success: false, message: `A opção ${option.label} não tem valores válidos.`, error: errors.invalidOption }
    }
    if (!option.values.every(value => typeof value === "string")) {
      return { success: false, message: `A opção ${option.label} não tem valores válidos.`, error: errors.invalidOption }
    }
    return { success: true, message: "Opção válida.", error: false }
  }
  _validateOptionAutocomplete(option) {
    return {
      success: false, message: `O tipo ${option.type} não foi implementado ainda.`, error: errors.invalidOption
    }
  }
}
