import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import TemplateEditor from "./TemplateEditor";
import "./index.css";
import { Select, MenuItem } from "@mui/material";
import AppDrawer from "./components/AppDrawer";
import AppBar from "./components/AppBar";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import buildTemplatesRepository from "./repositoy";

const templatesRepository = buildTemplatesRepository();

function Main() {
  const drawerState = React.useState(false);
  const [drawer, setDrawer] = drawerState;
  const routeState = React.useState("/");
  const [route] = routeState;

  const templatesState = React.useState(
    templatesRepository.getTemplateFile("default")
  );
  const [templates] = templatesState;

  const templatesKeysState = React.useState(
    templates != null ? Object.keys(templates) : []
  );
  const [templatesKeys] = templatesKeysState;

  const currentTemplateState = React.useState(
    templatesKeys.length > 0 ? templatesKeys[0] : []
  );
  const [currentTemplate, setCurrentTemplate] = currentTemplateState;

  const baseTextState = React.useState(
    templatesKeys.length > 0 ? templates[currentTemplate].baseText : ""
  );
  const [baseText] = baseTextState;

  const finalTextState = React.useState(baseText);
  const [finalText, setFinalText] = finalTextState;

  const templateValuesState = React.useState([]);
  const [templateValues, setTemplateValues] = templateValuesState;
  const restoreTemplateValuesState = React.useState(true);
  const [restoreTemplateValues, setRestoreTemplateValues] =
    restoreTemplateValuesState;

  React.useEffect(() => {
    const savedTemplateValues =
      templatesRepository.getTemplateValues(currentTemplate);
    if (savedTemplateValues) {
      setTemplateValues(savedTemplateValues);
      updateFinalText("useEffect");
      setRestoreTemplateValues(false);
    }
  }, [currentTemplate, restoreTemplateValues]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawer(open);
  };
  function selectCurrentForm({ target: { value } }) {
    if (!value) return;
    setCurrentTemplate(value);
  }
  const templateSelect = (
    <Select
      labelId="templates-label"
      label="Templates"
      id="template-select"
      onChange={selectCurrentForm}
      value={currentTemplate}
      variant="outlined"
      sx={{ color: "white", borderColor: "white" }}
    >
      {templatesKeys.map((key) => (
        <MenuItem key={key} value={key}>
          {key}
        </MenuItem>
      ))}
    </Select>
  );

  function renderComponent() {
    switch (route) {
      case "/":
        return (
          <App
            templatesState={templatesState}
            currentTemplateState={currentTemplateState}
            baseTextState={baseTextState}
            finalTextState={finalTextState}
            templateValuesState={templateValuesState}
            updateFinalText={updateFinalText}
          />
        );
      case "/template-editor":
        return (
          <TemplateEditor
            templatesState={templatesState}
            currentTemplateState={currentTemplateState}
            baseTextState={baseTextState}
            finalTextState={finalTextState}
            templateValuesState={templateValuesState}
            updateFinalText={updateFinalText}
          />
        );
      default:
        return (
          <App
            templatesState={templatesState}
            currentTemplateState={currentTemplateState}
            baseTextState={baseTextState}
            finalTextState={finalTextState}
            templateValuesState={templateValuesState}
            updateFinalText={updateFinalText}
          />
        );
    }
  }
  function updateFinalText(invokePlace, newTemplateValues) {
    console.log("invokePlace: ", invokePlace);
    let values = templateValues;
    if (newTemplateValues) {
      setTemplateValues(newTemplateValues);
      values = newTemplateValues;
    }
    let text = baseText;
    values.forEach((templateValue, index) => {
      if (Array.isArray(templateValue)) {
        let multipleItens = "";
        const multiValues = [];
        templateValue.forEach((v) => {
          if (v != null && v !== "" && v !== undefined) {
            multiValues.push(v);
          }
        });
        multiValues.forEach((item, i) => {
          multipleItens = multipleItens + `${i + 1}) ${item} `;
        });
        templateValue = multipleItens;
      }
      if (
        templateValue === "" ||
        templateValue === undefined ||
        templateValue === null
      ) {
        templateValue = `{{${index}}}`;
      } else {
        text = text.replace(`{{${index}}}`, templateValue);
      }
    });
    setFinalText(text);
    console.log(finalText);
  }
  return (
    <>
      <AppBar toggleDrawer={toggleDrawer} templateSelect={templateSelect} />
      <AppDrawer
        drawerState={drawerState}
        toggleDrawer={toggleDrawer}
        routeState={routeState}
      />
      {renderComponent()}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
