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
import buildTemplatesRepository from "./repositories/templates";

const templatesRepository = buildTemplatesRepository();

function Main() {
  const drawerState = React.useState(false);
  const [drawer, setDrawer] = drawerState;
  const routeState = React.useState(templatesRepository.getRoute() ?? "/");
  const [route, setRoute] = routeState;

  // TEXT EDITOR
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

  const templateValuesState = React.useState({});
  const [templateValues, setTemplateValues] = templateValuesState;
  const restoreTemplateValuesState = React.useState(true);
  const [restoreTemplateValues, setRestoreTemplateValues] =
    restoreTemplateValuesState;

  // TEMPLATE EDITOR
  const editorTemplatesState = React.useState(
    templatesRepository.getTemplateFile("editor") || {}
  );
  const [editorTemplates] = editorTemplatesState;
  const editorTemplatesKeysState = React.useState(
    editorTemplates != null ? Object.keys(editorTemplates) : []
  );
  const [editorTemplatesKeys] = editorTemplatesKeysState;
  const editorCurrentTemplateState = React.useState(
    editorTemplatesKeys.length > 0 ? editorTemplatesKeys[0] : []
  );
  const [editorCurrentTemplate, setEditorCurrentTemplate] =
    editorCurrentTemplateState;
  const editorBaseTextState = React.useState(
    editorTemplatesKeys.length > 0
      ? editorTemplates[editorCurrentTemplate].baseText
      : ""
  );

  React.useEffect(() => {
    if (restoreTemplateValues) {
      const savedTemplateValues =
        templatesRepository.getTemplateValues("default");
      if (savedTemplateValues) {
        Object.keys(savedTemplateValues).forEach((key) => {
          for (let i = 0; i < templates[key].options.length; i++) {
            if (!savedTemplateValues[key][i]) {
              savedTemplateValues[key][i] = null;
            }
          }
        })
        updateFinalText("useEffect", savedTemplateValues);
        setRestoreTemplateValues(false);
      }
    }
    const savedCurrentTemplate = templatesRepository.getCurrentTemplate();
    if (savedCurrentTemplate) {
      setCurrentTemplate(savedCurrentTemplate);
    }
  }, [currentTemplate, restoreTemplateValues, route]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawer(open);
  };
  function selectCurrentTemplate({ target: { value } }) {
    if (!value) return;
    setCurrentTemplate(value);
    templatesRepository.saveCurrentTemplate(value);
    updateFinalText("selectCurrentTemplate", templateValues);
  }
  function selectEditorTemplate({ target: { value } }) {
    if (!value) return;
    setEditorCurrentTemplate(value);
  }
  const templateSelect = (
    <Select
      labelId="templates-label"
      label="Templates"
      id="template-select"
      onChange={selectCurrentTemplate}
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

  const editorSelect = (
    <Select
      labelId="editor-label"
      label="Editor"
      id="editor-select"
      onChange={selectEditorTemplate}
      value={editorCurrentTemplate}
      variant="outlined"
      sx={{ color: "white", borderColor: "white" }}
    >
      {editorTemplatesKeys.map((key) => (
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
            editorTemplatesState={editorTemplatesState}
            editorTemplatesKeysState={editorTemplatesKeysState}
            editorCurrentTemplateState={editorCurrentTemplateState}
            editorBaseTextState={editorBaseTextState}
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
    console.log("invokePlace: ", invokePlace, currentTemplate);
    let values = templateValues[currentTemplate];
    if (!values) {
      values = [];
    }
    if (newTemplateValues) {
      setTemplateValues(newTemplateValues);
      values = newTemplateValues[currentTemplate];
    }
    let text = baseText;
    console.log("V", values);
    console.log("t V", typeof values);
    console.log("a V", Array.isArray(values));
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
      <AppBar
        toggleDrawer={toggleDrawer}
        templateSelect={templateSelect}
        editorSelect={editorSelect}
      />
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
