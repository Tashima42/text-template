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
  const { currentTemplate, finalTextState, templateValuesState } = props;

  const [finalText, setFinalText] = finalTextState;
  const [templateValues, setTemplateValues] = templateValuesState;

  return (
    <div className="App">
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
    </div>
  );

  function resetTemplateForm() {
    const confirmReset = confirm("Tem certeza que deseja resetar os campos?");
    if (confirmReset) {
      templatesRepository.saveTemplateValuesOld(templateValues);
      templatesRepository.saveTemplateValuesDefault([]);
      setFinalText(currentTemplate.getBaseText());
    }
  }
  function recoverTemplateForm() {
    const savedTemplateValues = templatesRepository.getTemplateValuesOld();
    if (savedTemplateValues) {
      templatesRepository.saveTemplateValuesDefault(savedTemplateValues);
      setTemplateValues(savedTemplateValues);
      console.log("TemplateValuesRecover", templateValues);
      setFinalText(currentTemplate.replaceTextVariables(templateValues));
    }
  }

  function createForm() {
    if (!currentTemplate) {
      return <div>Loading...</div>;
    }
    return (
      <form>
        <div className="template-form">
          {currentTemplate.getOptions().map((option, index) => {
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
                        templateValues && templateValues[id]
                          ? templateValues[id]
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
                      value={
                        templateValues &&
                        templateValues[id] &&
                        Array.isArray(templateValues[id])
                          ? templateValues[id]
                          : []
                      }
                      multiple
                      renderValue={() => ""}
                      onChange={handleFormValuesChange(id)}
                    >
                      {option.values.map((v, i) => {
                        return (
                          <MenuItem key={i} value={v}>
                            <Checkbox
                              checked={
                                templateValues &&
                                Array.isArray(templateValues[id]) &&
                                templateValues[id].indexOf(v) > -1
                                  ? true
                                  : false
                              }
                            />
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
                const label = option.label
                  ? `${index + 1} - ${option.label}`
                  : id;
                return (
                  <TextField
                    id={id}
                    key={id}
                    className="text-input"
                    label={label}
                    variant="outlined"
                    value={
                      templateValues && templateValues[id]
                        ? templateValues[id]
                        : ""
                    }
                    onChange={handleFormValuesChange(id)}
                    sx={{ m: 1, minWidth: 240 }}
                  />
                );
              }
            }
          })}
        </div>
      </form>
    );
  }

  function handleFormValuesChange(id) {
    return function (event) {
      console.log(event);
      let {
        target: { value },
      } = event;
      let copyTemplateValues = { ...templateValues };
      copyTemplateValues[id] = value;

      setTemplateValues(copyTemplateValues);
      templatesRepository.saveTemplateValuesDefault(copyTemplateValues);
      console.log("handleFormValuesChange", copyTemplateValues);
      const updatedFinalText =
        currentTemplate.replaceTextVariables(copyTemplateValues);
      console.log("updatedFinalText", updatedFinalText);
      setFinalText(updatedFinalText);
    };
  }
}

export default App;
