import * as React from "react";
import "./App.css";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import buildTemplatesRepository from "./repositoy";

const templatesRepository = buildTemplatesRepository();

function TemplateEditor(props) {
  const [templates, setTemplates] = React.useState(
    templatesRepository.getTemplateFile("editor")
  );
  const [templatesKeys, setTemplatesKeys] = React.useState(
    templates != null ? Object.keys(templates) : []
  );
  const [currentTemplate, setCurrentTemplate] = React.useState(
    templatesKeys.length > 0 ? templatesKeys[0] : []
  );
  const [baseText, setBaseText] = React.useState(
    templatesKeys.length > 0 ? templates[currentTemplate].baseText : ""
  );
  const [finalText, setFinalText] = React.useState(baseText);

  React.useEffect(() => {}, [templates, baseText]);

  return (
    <div className="App">
      {templates != null && templates[currentTemplate] != null && (
        <div className="text-editor">
          <textarea
            className="text-area"
            value={baseText}
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
            </div>
          </Box>
        </div>
      )}
    </div>
  );

  function addTemplateVariable() {
    templates[currentTemplate].baseText += ` {{${
      templates[currentTemplate].options.length + 1
    }}}`;
    templates[currentTemplate].options.push(null);
    setBaseText(templates[currentTemplate].baseText);
    handleTextChange({
      target: { value: templates[currentTemplate].baseText },
    });
  }

  function handleTextChange(event) {
    console.log(event);
    setBaseText(event.target.value);
    const variablesCount = countVariablesInText(event.target.value);
    if (variablesCount != templates[currentTemplate].options.length) {
      for (
        let i = templates[currentTemplate].options.length;
        i < variablesCount;
        i++
      ) {
        templates[currentTemplate].options.push(null);
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
    const createdForms = templates[currentTemplate].options.map(
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
