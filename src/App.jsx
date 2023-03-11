import * as React from 'react'
import './App.css'
import AppDrawer from './components/AppDrawer'
import AppBar from "./components/AppBar"
import {
  Autocomplete, 
  TextField, 
  Box, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
} from "@mui/material"
import forms from "./assets/forms"

function App() {
  const drawerState = React.useState(false)
  const [drawer, setDrawer] = drawerState
  const [title, setTitle] = React.useState("Editor de templates")

  const templatesKeys = Object.keys(forms)
  const [currentForm, setCurrentForm] = React.useState(templatesKeys[0])
  const [baseText, setBaseText] = React.useState(forms[currentForm].baseText)
  const [finalText, setFinalText] = React.useState(baseText)
  const [templateValues, setTemplateValues] = React.useState([])

  // React.useEffect(() => {
  //   setTemplateValues([])
  //   setBaseText(forms[currentForm].baseText)
  // }, [currentForm])

  React.useEffect(() => {
    setFinalText(baseText)
  }, [baseText])

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
      value={currentForm}
    >
    {templatesKeys.map((key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}  
    </Select>
  )

  return (
    <div className="App">
      <AppBar title={title} toggleDrawer={toggleDrawer} templateSelect={templateSelect}/>
      <AppDrawer drawerState={drawerState} toggleDrawer={toggleDrawer}/> 
      <div className='text-editor'>
        <textarea readOnly={true} className='text-area' value={finalText}></textarea>
        <Box style={{maxHeight: '90vh'}} className="box">
          {createForm()}
        </Box>
      </div>
    </div>
  )

  function selectCurrentForm({target: {value}}) {
    if (!value) return
    setCurrentForm(value)
  }

  function createForm() {
    const createdForms = forms[currentForm].options.map((form, index) => {
      switch (form.type) {
      case "select": {
        const id = String(index + 1)
        const label = form.label ? `${id} - ${form.label}` : id
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
              {form.values.map((value, i) => {
                return <MenuItem key={i} value={value}>{value}</MenuItem>
              })}  
              </Select>
            </FormControl>
          )
      }
      case "multi-select": {
        const id = String(index + 1)
        const label = form.label ? `${id} - ${form.label}` : id
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
              renderValue={(selected) => selected.join(', ')}
              onChange={handleFormValuesChange(id)}
            >
              {form.values.map((value, i) => {
                return <MenuItem key={i} value={value}>{value}
                  <Checkbox checked={personName.indexOf(name) > -1} />
                </MenuItem>
              })}  
              </Select>
            </FormControl>
          )
      }
      case "input": {
        const id = String((index + 1) + "-option")
        const label = form.label ? `${index + 1} - ${form.label}` : id
        return <TextField
          id={id}
          key={id}
          className="text-input"
          label={label}
          variant="outlined"
          onChange={handleFormValuesChange}
        />
      }
      default: {
        return (<div></div>)
      }
    }
    })
    return (
      <form>
        {createdForms}
      </form>
    )
  }

  function handleFormValuesChange(id) {
    return function (event) {
      let value = event.target.value
      // Handle Itens with multiple valid options
      const multipleItensIndex = id.split(".")
      if (multipleItensIndex && multipleItensIndex.length > 1) {
        if (!templateValues[multipleItensIndex[0]]) templateValues[multipleItensIndex[0]] = []
        templateValues[multipleItensIndex[0]][multipleItensIndex[1]] = value
      } else {
        console.log("else")
        templateValues[id] = value
        console.log("index: ", id, templateValues[id])
      }

      setTemplateValues(templateValues)
      updateFinalText()
    }
  }
  function updateFinalText() {
    let text = baseText
    templateValues.forEach((templateValue, index) => {
      // Handle itens with multiple valid options
      if (Array.isArray(templateValue)) {
        let multipleItens = ""
        templateValue.forEach((item, i) => {
          multipleItens = multipleItens + `${i}) ${item} `
        })
        templateValue = multipleItens
      }
      console.log("templateValue first: ", templateValue)
      if (templateValue === "" || templateValue === undefined || templateValue === null) {
        console.log("templateValue: ", templateValue)
        templateValue = `{{${index}}}`
      } else {
        text = text.replace(`{{${index}}}`, templateValue)
      }       
    })
    setFinalText(text)
  }
}

export default App