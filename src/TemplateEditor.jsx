import * as React from "react";
import "./App.css";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
} from "@mui/material";
import NewTemplateModal from "./components/NewTemplateModal";
import buildTemplatesRepository from "./repositoy";

const templatesRepository = buildTemplatesRepository();

function TemplateEditor(props) {
  const {
    editorTemplatesState,
    editorTemplatesKeysState,
    editorCurrentTemplateState,
    editorBaseTextState,
  } = props
  const newTemplateModalState = React.useState(false);
  const [newTemplateModal, setNewTemplateModal] = newTemplateModalState;
  const [editorTemplates, setEditorTemplates] = editorTemplatesState;
  const [editorTemplatesKeys, setEditorTemplatesKeys] = editorTemplatesKeysState;
  const [editorCurrentTemplate, setEditorCurrentTemplate] = editorCurrentTemplateState;
  const [editorBaseText, setEditorBaseText] = editorBaseTextState;
  const [editorFinalText, setEditorFinalText] = React.useState(editorBaseText);

  // React.useEffect(() => {}, [editorTemplates, editorBaseText]);

  return (
    <div className="App">
      <NewTemplateModal openState={newTemplateModalState} handleOpen={newTemplateModalHandle} editorTemplatesState={editorTemplatesState}/>
      {(editorTemplates != null && editorTemplates[editorCurrentTemplate] != null) 
      ? (
        <div className="text-editor">
          <textarea
            className="text-area"
            value={editorBaseText}
            onChange={handleTextChange}
          ></textarea>
          <Box style={{ maxHeight: "90vh" }} className="box">
            {createForm()}
            <div className="editor-buttons">
              <Button
                className="editor-button"
                variant="contained"
                onClick={addTemplateVariable}
              >
                Adicionar Variavel
              </Button>
              <Button className="create-button" variant="contained" onClick={() => newTemplateModalHandle(true)}>Criar novo template</Button>
              <Button className="apply-button" variant="contained" onClick={applyCurrentEditorTemplate}>Aplicar template sendo editado</Button>
              <Button className="edit-button" variant="contained" onClick={editCurrentTemplate}>Editar template carregado</Button>
            </div>
          </Box>
        </div>
      )
      : (
        <div className="new-template">
          <Button className="create-button" variant="contained" onClick={() => newTemplateModalHandle(true)}>Criar novo template</Button>
          <Button className="edit-button" variant="contained" onClick={editCurrentTemplate}>Editar template carregado</Button>
        </div>
      )
    }
    </div>
  );

  function applyCurrentEditorTemplate() {
    const currentAppliedTemplate = templatesRepository.getTemplateFile("default");
    templatesRepository.saveTemplateFile("old", currentAppliedTemplate);
    templatesRepository.saveTemplateFile("default", editorTemplates);
    window.location.reload()
  } 

  function editCurrentTemplate() {
    const currentAppliedTemplate = templatesRepository.getTemplateFile("default");
    const currentEditorTemplate = templatesRepository.getTemplateFile("editor");
    templatesRepository.saveTemplateFile("editor-old", currentEditorTemplate);
    templatesRepository.saveTemplateFile("editor", currentAppliedTemplate);
    window.location.reload()
  }

  function newTemplateModalHandle(openState) {
    setNewTemplateModal(openState);
  }

  function addTemplateVariable() {
    editorTemplates[editorCurrentTemplate].baseText += ` {{${
      editorTemplates[editorCurrentTemplate].options.length + 1
    }}}`;
    editorTemplates[editorCurrentTemplate].options.push(null);
    setEditorBaseText(editorTemplates[editorCurrentTemplate].baseText);
    handleTextChange({
      target: { value: editorTemplates[editorCurrentTemplate].baseText },
    });
  }

  function handleTextChange(event) {
    console.log(event);
    setEditorBaseText(event.target.value);
    const variablesCount = countVariablesInText(event.target.value);
    if (variablesCount != editorTemplates[editorCurrentTemplate].options.length) {
      for (
        let i = editorTemplates[editorCurrentTemplate].options.length;
        i < variablesCount;
        i++
      ) {
        editorTemplates[editorCurrentTemplate].options.push(null);
      }
    }
  }

  function countVariablesInText(text) {
    const regex = /\{\{(\d+)\}\}/g;
    const matches = text.match(regex);

    const count = matches ? matches.length : 0;
    return count;
  }

  function createForm() {
    const createdForms = editorTemplates[editorCurrentTemplate].options.map(
      (option, index) => {
        switch (option) {
          case null:
            const id = String(index + 1);
            return (
              <FormControl key={id} sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id={`select-label-${id}`}>
                  Tipo da variavel{id}
                </InputLabel>
                <Select labelId={`select-label-${id}`} id={`select-${id}`}>
                  <MenuItem value="select">Selecionar</MenuItem>
                  <MenuItem value="multi-select">Multiplas Opções</MenuItem>
                  <MenuItem value="input">Texto</MenuItem>
                </Select>
              </FormControl>
            );
        }
      }
    );
    return (
      <form>
        <div className="template-form">{createdForms}</div>
      </form>
    );
  }
}

export default TemplateEditor;
