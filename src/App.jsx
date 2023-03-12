import * as React from 'react'
import './App.css'
import AppDrawer from './components/AppDrawer'
import AppBar from "./components/AppBar"
import {
  TextField, 
  Box, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Button
} from "@mui/material"
import buildTemplatesRepository from "./repositoy"

const templatesRepository = buildTemplatesRepository()

function App() {
  const drawerState = React.useState(false)
  const [drawer, setDrawer] = drawerState
  const [title, setTitle] = React.useState("Editor de templates")

  const [templates, setTemplates] = React.useState(
    templatesRepository.getTemplateFile("default")
  )
  const [templatesKeys ,setTemplatesKeys] = React.useState(
    templates != null ? Object.keys(templates) : []
  )

  const [currentTemplate, setCurrentTemplate] = React.useState(
    templatesKeys.length > 0 ? templatesKeys[0] : []
  )
  const [baseText, setBaseText] = React.useState(
    templatesKeys.length > 0 ? templates[currentTemplate].baseText : ""
  )
  const [finalText, setFinalText] = React.useState(baseText)
  const [templateValues, setTemplateValues] = React.useState([])
  const [restoreTemplateValues, setRestoreTemplateValues] = React.useState(true)

  React.useEffect(() => {
    const savedTemplateValues = templatesRepository.getTemplateValues(currentTemplate)
    if (savedTemplateValues) {
      setTemplateValues(savedTemplateValues)
      updateFinalText("useEffect")
      setRestoreTemplateValues(false)
    }
  }, [currentTemplate, restoreTemplateValues])

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(open)
  };

  const templateSelect = (
    <Select
      labelId='templates-label'
      label="Templates"
      id="template-select"
      onChange={selectCurrentForm}
      value={currentTemplate}
    >
    {templatesKeys.map((key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}  
    </Select>
  )

  return (
    <div className="App">
      <AppBar title={title} toggleDrawer={toggleDrawer} templateSelect={templateSelect}/>
      <AppDrawer drawerState={drawerState} toggleDrawer={toggleDrawer}/> 
      {
        (templates != null && templates[currentTemplate] != null) && (
          <div className='text-editor'>
            <textarea readOnly={true} className='text-area' value={finalText}></textarea>
            <Box style={{maxHeight: '90vh'}} className="box">
              {createForm()}
              <Button className="form-button" variant="contained" onClick={resetTemplateForm}>Resetar campos</Button>
              <Button className="form-button" variant="contained" onClick={recoverTemplateForm}>Resgatar campos resetados</Button>
            </Box>
          </div>
        )
      }
    </div>
  )

  function selectCurrentForm({target: {value}}) {
    if (!value) return
    setCurrentTemplate(value)
  }

  function resetTemplateForm() {
    const confirmReset = confirm("Tem certeza que deseja resetar os campos?")
    if (confirmReset) {
      templatesRepository.saveTemplateValues(`old-${currentTemplate}`, templateValues)
      templatesRepository.saveTemplateValues(currentTemplate, [])
      setTemplateValues([])
      updateFinalText("resetTemplateForm")
    }
  }
  function recoverTemplateForm() {
    const savedTemplateValues = templatesRepository.getTemplateValues(`old-${currentTemplate}`)
    console.log("saved: ", savedTemplateValues)
    if (savedTemplateValues) {
      templatesRepository.saveTemplateValues(currentTemplate, savedTemplateValues)
      setTemplateValues(savedTemplateValues)
      updateFinalText("recoverTemplateForm")
    }
  }

  function createForm() {
    const createdForms = templates[currentTemplate].options.map((option, index) => {
      switch (option.type) {
      case "select": {
        const id = String(index + 1)
        const label = option.label ? `${id} - ${option.label}` : id
        return (
          <FormControl key={id} sx={{ m: 1, minWidth: 240 }} className="select">
            <InputLabel id={label}>{label}</InputLabel>
            <Select
              labelId={label}
              label={label}
              id={id}
              key={id}
              value={templateValues[id] ?? ""}
              placeholder={label}
              onChange={handleFormValuesChange(id)}
            >
              <MenuItem value={null}><em>Selecione uma opção</em></MenuItem>
              {option.values.map((value, i) => {
                return <MenuItem key={i} value={value}>{value}</MenuItem>
              })}  
              </Select>
            </FormControl>
          )
      }
      case "multi-select": {
        const id = String(index + 1)
        const label = option.label ? `${id} - ${option.label}` : id
        return (
          <FormControl key={id} sx={{ m: 1, minWidth: 240 }} className="select">
            <InputLabel id={label}>{label}</InputLabel>
            <Select
              labelId={label}
              label={label}
              id={id}
              key={id}
              placeholder={label}
              value={""}
              renderValue={() => ""}
              onChange={handleFormValuesChange(id)}
            >
              {option.values.map((v, i) => {
                const checked = Array.isArray(templateValues[id]) && templateValues[id].indexOf(v) > -1 
                const value = `${i}|-|${v}`
                return <MenuItem key={i} value={value}>
                  <Checkbox checked={checked} />
                  <ListItemText primary={v} />
                </MenuItem>
              })}  
              </Select>
            </FormControl>
          )
      }
      case "input": {
        const id = String(index + 1)
        const label = option.label ? `${index + 1} - ${option.label}` : id
        return <TextField
          id={id}
          key={id}
          className="text-input"
          label={label}
          variant="outlined"
          value={templateValues[id] ?? ""}
          onChange={handleFormValuesChange(id)}
        />
      }
      default: {
        return (<div></div>)
      }
    }
    })
    return (
      <form>
        <div className='template-form'>
          {createdForms}
        </div>
      </form>
    )
  }

  function handleFormValuesChange(id) {
    return function (event) {
      console.log(event)
      let  { target: { value } } = event

      if (value != null) {
        const multiSplit = value.split("|-|")
        if (multiSplit && multiSplit.length > 1) {
          value = multiSplit[1]
          let templateValueIndex = -1
          if (Array.isArray(templateValues[id])) {
            templateValueIndex = templateValues[id].indexOf(value)
          }
          if (templateValueIndex > -1) {
            templateValues[id].splice(templateValueIndex, 1)
          } else {
            const multiSubIndex = multiSplit[0]
            if (!templateValues[id]) {
              templateValues[id] = []
            }
            templateValues[id][multiSubIndex] = value
          }
        } else {
          templateValues[id] = value
        }
      } else {
          templateValues[id] = value
      }

      setTemplateValues(templateValues)
      templatesRepository.saveTemplateValues(currentTemplate, templateValues)
      updateFinalText("handleFormValuesChange")
    }
  }
  function updateFinalText(invokePlace) {
    console.log("invokePlace: ", invokePlace)
    let text = baseText
    templateValues.forEach((templateValue, index) => {
      if (Array.isArray(templateValue)) {
        let multipleItens = ""
        const multiValues = [] 
        templateValue.forEach((v) => {
          if (v != null && v !== "" && v !== undefined) {
            multiValues.push(v)
          }
        })
        multiValues.forEach((item, i) => {
          multipleItens = multipleItens + `${i + 1}) ${item} `
        })
        templateValue = multipleItens
      }
      if (templateValue === "" || templateValue === undefined || templateValue === null) {
        templateValue = `{{${index}}}`
      } else {
        text = text.replace(`{{${index}}}`, templateValue)
      }       
    })
    setFinalText(text)
  }
}

export default App