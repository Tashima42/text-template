import * as React from "react";
import "./App.css";
import {
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Button,
} from "@mui/material";
import buildTemplatesRepository from "./repositories/templates";

const templatesRepository = buildTemplatesRepository();

function App(props) {
  const {
    templatesState,
    currentTemplateState,
    baseTextState,
    finalTextState,
    templateValuesState,
    updateFinalText,
  } = props;

  const [templates] = templatesState;
  const [currentTemplate] = currentTemplateState;
  const [baseText] = baseTextState;
  const [finalText, setFinalText] = finalTextState;
  const [templateValues, setTemplateValues] = templateValuesState;

  return (
    <div className="App">
      {templates != null && templates[currentTemplate] != null && (
        <div className="text-editor">
          <textarea
            readOnly={true}
            className="text-area"
            value={finalText}
          ></textarea>
          <Box style={{ maxHeight: "90vh", overflow: "scroll" }} className="box">
            {createForm()}
            <div className="form-buttons">
              <Button
                className="form-button"
                variant="contained"
                onClick={resetTemplateForm}
              >
                Resetar campos
              </Button>
              <Button
                className="form-button"
                variant="contained"
                onClick={recoverTemplateForm}
              >
                Resgatar campos resetados
              </Button>
            </div>
          </Box>
        </div>
      )}
    </div>
  );

  function resetTemplateForm() {
    const confirmReset = confirm("Tem certeza que deseja resetar os campos?");
    if (confirmReset) {
      templatesRepository.saveTemplateValues("old", templateValues);
      templatesRepository.saveTemplateValues("default", []);
      updateFinalText("resetTemplateForm", []);
    }
  }
  function recoverTemplateForm() {
    const savedTemplateValues = templatesRepository.getTemplateValues("old");
    console.log("saved: ", savedTemplateValues);
    if (savedTemplateValues) {
      templatesRepository.saveTemplateValues("default", savedTemplateValues);
      setTemplateValues(savedTemplateValues);
      updateFinalText("recoverTemplateForm", savedTemplateValues);
    }
  }

  function createForm() {
    const createdForms = templates[currentTemplate].options.map(
      (option, index) => {
        switch (option.type) {
          case "select": {
            const id = String(index + 1);
            const label = option.label ? `${id} - ${option.label}` : id;
            return (
              <FormControl
                key={id}
                sx={{ m: 1, minWidth: 240 }}
                className="select"
              >
                <InputLabel id={label}>{label}</InputLabel>
                <Select
                  labelId={label}
                  label={label}
                  id={id}
                  key={id}
                  value={
                    templateValues[currentTemplate]
                      ? templateValues[currentTemplate][id]
                      : ""
                  }
                  placeholder={label}
                  onChange={handleFormValuesChange(id)}
                >
                  <MenuItem value={null}>
                    <em>Selecione uma opção</em>
                  </MenuItem>
                  {option.values.map((value, i) => {
                    return (
                      <MenuItem key={i} value={value}>
                        {value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            );
          }
          case "multi-select": {
            const id = String(index + 1);
            const label = option.label ? `${id} - ${option.label}` : id;
            return (
              <FormControl
                key={id}
                sx={{ m: 1, minWidth: 240 }}
                className="select"
              >
                <InputLabel id={label}>{label}</InputLabel>
                <Select
                  labelId={label}
                  label={label}
                  id={id}
                  key={id}
                  placeholder={label}
                  value={(() => {
                    if (templateValues[currentTemplate]) {
                      if (Array.isArray(templateValues[currentTemplate][id])) {
                        return templateValues[currentTemplate][id];
                      }
                    }
                    return [];
                  })()}
                  multiple
                  renderValue={() => ""}
                  onChange={handleFormValuesChange(id)}
                >
                  {option.values.map((v, i) => {
                    const checked = templateValues[currentTemplate]
                      ? Array.isArray(templateValues[currentTemplate][id]) &&
                        templateValues[currentTemplate][id].indexOf(v) > -1
                      : false;
                    return (
                      <MenuItem key={i} value={v}>
                        <Checkbox checked={checked} />
                        <ListItemText primary={v} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            );
          }
          case "input": {
            const id = String(index + 1);
            const label = option.label ? `${index + 1} - ${option.label}` : id;
            return (
              <TextField
                id={id}
                key={id}
                className="text-input"
                label={label}
                variant="outlined"
                value={
                  templateValues[currentTemplate]
                    ? templateValues[currentTemplate][id]
                    : ""
                }
                onChange={handleFormValuesChange(id)}
                sx={{ m: 1, minWidth: 240 }}
              />
            );
          }
        }
      }
    );
    return (
      <form>
        <div className="template-form">{createdForms}</div>
      </form>
    );
  }

  function handleFormValuesChange(id) {
    return function (event) {
      console.log(event);
      let {
        target: { value },
      } = event;

      if (templateValues[currentTemplate]) {
        templateValues[currentTemplate][id] = value;
      } else {
        templateValues[currentTemplate] = [];
        templateValues[currentTemplate][id] = value;
      }

      setTemplateValues(templateValues);
      console.log("templateValues: ", templateValues);
      templatesRepository.saveTemplateValues("default", templateValues);
      updateFinalText("handleFormValuesChange");
    };
  }
}

export default App;
