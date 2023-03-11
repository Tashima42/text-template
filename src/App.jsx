import * as React from 'react'
import './App.css'
import AppDrawer from './components/AppDrawer'
import AppBar from "./components/AppBar"
import {Autocomplete, TextField, Box, Select, MenuItem} from "@mui/material"
import forms from "./assets/forms"

function App() {
  const drawerState = React.useState(false)
  const [drawer, setDrawer] = drawerState
  const [title, setTitle] = React.useState("Editor de templates")

  const templatesKeys = Object.keys(forms)
  const [currentForm, setCurrentForm] = React.useState(templatesKeys[0])
  const [baseText, setBaseText] = React.useState(forms[currentForm].textoBase)
  const [finalText, setFinalText] = React.useState(baseText)
  const [templateValues, setTemplateValues] = React.useState([])

  React.useEffect(() => {
    setTemplateValues([])
    setBaseText(forms[currentForm].textoBase)
  }, [currentForm])

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
        <Box style={{maxHeight: '90vh', overflow: 'auto'}}>
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
    const createdForms = forms[currentForm].opcoes.map((form, index) => {
      if (form.tipo === "multiplos-textos") {
        return form.valores.map((_, i) => {
          const id = `${index + 1}.${i + 1}`
          const label = form.legenda ? `${id} - ${form.legenda}` : id
          return <Autocomplete
            className="autocomplete"
            id={id}
            options={form.valores}
            sx={{width: 700}}
            renderInput={(params) => <TextField {...params} label={label} />}
            key={id}
            onChange={handleFormValuesChange}
          />
        })
      } else if (form.tipo === "texto") {
        const id = String(index + 1)
        const label = form.legenda ? `${id} - ${form.legenda}` : id
        return <Autocomplete
          className="autocomplete"
          id={id}
          options={form.valores}
          sx={{width: 700}}
          renderInput={(params) => <TextField {...params} label={label} />}
          key={id}
          onChange={handleFormValuesChange}
        />
      } else if (form.tipo === "texto-input") {
        const id = String((index + 1) + "-option")
        const label = form.legenda ? `${index + 1} - ${form.legenda}` : id
        return <TextField
          id={id}
          key={id}
          className="text-input"
          label={label}
          variant="outlined"
          onChange={handleFormValuesChange}
        />
      }
      return (<div></div>)
    })
    return (
      <form>
        {createdForms}
      </form>
    )
  }

  function handleFormValuesChange(event, value) {
    if (!value) {
      value = event.target.value
      if (!value) return
    }
    const id = event.target.id
    const index = id.split('-')[0]
    // Handle Itens with multiple valid options
    const multipleItensIndex = index.split(".")
    if (multipleItensIndex && multipleItensIndex.length > 1) {
      if (!templateValues[multipleItensIndex[0]]) templateValues[multipleItensIndex[0]] = []
      templateValues[multipleItensIndex[0]][multipleItensIndex[1]] = value
    } else templateValues[index] = value

    setTemplateValues(templateValues)
    updateFinalText()
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
      text = text.replace(`{{${index}}}`, templateValue)
    })
    setFinalText(text)
  }
}

export default App