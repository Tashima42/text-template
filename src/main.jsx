import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AppDrawer from "./components/AppDrawer";
import AppBar from "./components/AppBar";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import buildTemplatesRepository from "./repositories/templates";
import { Button } from "@mui/material";
import { TemplateConfig } from "./template.js";

const templatesRepository = buildTemplatesRepository();

function Main() {
  const drawerState = React.useState(false);
  const [_, setDrawer] = drawerState;
  const routeState = React.useState(templatesRepository.getRoute() ?? "/");
  const [route, setRoute] = routeState;

  // TEXT EDITOR
  const templatesKeysState = React.useState([]);
  const [templatesKeys, setTemplatesKeys] = templatesKeysState;

  const selectedTemplateState = React.useState();
  const [selectedTemplate, setSelectedTemplate] = selectedTemplateState;

  const currentTemplateState = React.useState();
  const [currentTemplate, setCurrentTemplate] = currentTemplateState;

  const finalTextState = React.useState();
  const [finalText, setFinalText] = finalTextState;

  const templateValuesState = React.useState({});
  const [templateValues, setTemplateValues] = templateValuesState;

  const [recoveredTemplateFile, setRecoveredTemplateFile] =
    React.useState(false);

  React.useEffect(() => {
    const templateFile = templatesRepository.getTemplateFileDefault();
    if (!templateFile) {
      // ask for upload
      return;
    }
    const templateConfig = new TemplateConfig(templateFile);
    const templateResult = templateConfig.parse();
    if (!templateResult.success) {
      setRecoveredTemplateFile(false);
      alert(templateResult.message);
      // ask for reupload depending on error
      return;
    }
    setRecoveredTemplateFile(true);
    setTemplatesKeys(templateConfig.getTemplatesKeys());

    const storageSelectedTemplate = templatesRepository.getSelectedTemplate();
    if (storageSelectedTemplate) {
      setSelectedTemplate(storageSelectedTemplate);
    }

    if (!selectedTemplate) {
      templatesRepository.saveSelectedTemplate(templatesKeys[0]);
      setSelectedTemplate(templatesKeys[0]);
    }

    if (!currentTemplate) {
      setCurrentTemplate(templateConfig.getTemplate(selectedTemplate));
    }

    if (!templateValues) {
      let storageValues;
      try {
        storageValues = JSON.parse(
          templatesRepository.getTemplateFileDefault()
        );
        setTemplateValues(storageValues);
      } catch (error) {
        console.log(error);
      }
    }

    if (templateValues) {
      setFinalText(currentTemplate.replaceTextVariables(templateValues));
    }
  }, [selectedTemplate, route]);

  return (
    <>
      <AppBar
        toggleDrawer={toggleDrawer}
        setSelectedTemplate={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
        templatesKeys={templatesKeys}
      />
      <AppDrawer
        drawerState={drawerState}
        toggleDrawer={toggleDrawer}
        routeState={routeState}
      />
      {renderComponent()}
    </>
  );

  function renderComponent() {
    switch (route) {
      case "/":
      default:
        return recoveredTemplateFile ? (
          <App
            currentTemplate={currentTemplate}
            finalTextState={finalTextState}
            templateValuesState={templateValuesState}
          />
        ) : (
          <div>
            <Button>Fazer upload</Button>
          </div>
        );
    }
  }

  function toggleDrawer(open) {
    return (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setDrawer(open);
    };
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
