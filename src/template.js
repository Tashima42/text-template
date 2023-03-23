import consts from './consts.js'
import errors from './errors.js'

/**
 * @class Template
 * Class to handle the template config file
 */
export class Template {
  name;
  baseText;
  options;

  constructor(name, template) {
    this.name = name;
    this.baseText = template.baseText;
    this.options = template.options;
  }

  getBaseText() {
    return this.baseText;
  }
  getOptions() {
    return this.options;
  }

  /**
   * Replace text variables with values 
   * @param {String} text 
   * @param {Array} values 
   * @returns {String}
   */
  replaceTextVariables(values) {
    let text = this.getBaseText()
    if (!values || Object.keys(values).length === 0) {
      return text
    }

    console.log("options", this.options)
    console.log("values", values)
    this.options.forEach((option) => {
      let value = values[option.id]
      if (!value) return
      console.log("value", value)
      if (Array.isArray(value)) {
        const multiValues = filterInvalidValues(value)
        value = numberSelectedItens(multiValues)
      }
      value = replaceEmptyValueWithIndex(value, option.id)
      text = text.replace(`{{${option.id}}}`, value)
    })
    return text

    function filterInvalidValues(values) {
      return values.filter((s) => {
        if (s != null && s !== "" && s !== undefined) {
          return s
        }
      })
    }
    function numberSelectedItens(multiValues) {
      let text = ""
      multiValues.forEach((item, i) => {
        if (i !== 0) text = text + " "
        text = text + `${i + 1}) ${item}`
      })
      return text
    }
    function replaceEmptyValueWithIndex(value, index) {
      if (value === "" || value === undefined || value === null) {
        return `{{${index}}}`
      }
      return value
    }
  }
}

export class TemplateConfig {
  configString;
  config;
  templatesKeys;
  text;
  values;
  templates;

  /**
   * @param {String} configString 
   */
  constructor(configString) {
    this.configString = configString
    this.templates = {}
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
    if (!this.config) {
      return { success: false, message: 'Não foi possível ler o arquivo de configuração.', error: errors.failedToJSONParse }
    }
    // Verify the config file version
    if (this.config.version != consts.templateConfigVersion) {
      return { success: false, message: `Versão da configuração é '${this.config.version}', a versão esperada era '${consts.templateConfigVersion}', essa configuração pode não funcionar.`, error: errors.mismatchedConfigVersion }
    }
    // Get the template names and save
    this._hidrateTemplatesKeys()
    // validate all templates
    this.templatesKeys.forEach(templateKey => {
      const template = this.config.templates[templateKey]
      const validation = this._validateTemplateTypes(template)
      if (!validation.success) {
        return validation
      }
      this.templates[templateKey] = new Template(templateKey, template)
    })
    return { success: true, message: "Configuração carregada com sucesso.", error: false }
  }

  /**
   * Get the templates names
   * @returns {Array} [String]
   */
  getTemplatesKeys() {
    return this.templatesKeys
  }
  getTemplate(templateName) {
    return this.templates[templateName]
  }
  _hidrateTemplatesKeys() {
    this.templatesKeys = Object.keys(this.config.templates)
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
