import * as React from "react";
import Drawer from "@mui/material/Drawer";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { TextSnippet, AccountTree, AddCircle, Save } from "@mui/icons-material";
import UploadTemplateFileModal from "./UploadTemplateFileModal";
import buildTemplatesRepository from "../repositories/templates";

const templatesRepository = buildTemplatesRepository();

export default function AppDrawer(props) {
  const uploadModalState = React.useState(false);
  const [route, setRoute] = props.routeState;
  const [_, setOpen] = uploadModalState;
  const [drawer] = props.drawerState;
  const toggleDrawer = props.toggleDrawer;

  function handleOpen(openState) {
    setOpen(openState);
  }

  function handleTemplateEditorRoute() {
    setRoute("/template-editor");
  }
  function handleTextEditorRoute() {
    setRoute("/");
  }

  async function handleDownload() {
    const json = JSON.stringify(templatesRepository.getTemplateFileDefault());
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `text-template-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <React.Fragment>
      <UploadTemplateFileModal
        openState={uploadModalState}
        handleOpen={handleOpen}
      />
      <Drawer open={drawer} onClose={toggleDrawer(false)}>
        <List>
          <ListItem>
            <ListItemButton onClick={handleTextEditorRoute}>
              <ListItemIcon>
                <TextSnippet />
              </ListItemIcon>
              <ListItemText primary="Editor de texto" />
            </ListItemButton>
          </ListItem>
          {/* <ListItem>
            <ListItemButton onClick={handleTemplateEditorRoute}>
              <ListItemIcon>
                <AccountTree />
              </ListItemIcon>
              <ListItemText primary="Editor de template" />
            </ListItemButton>
          </ListItem> */}
          <ListItem>
            <ListItemButton onClick={() => handleOpen(true)}>
              <ListItemIcon>
                <AddCircle />
              </ListItemIcon>
              <ListItemText primary="Adicionar ou substituir arquivo de templates" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={handleDownload}>
              <ListItemIcon>
                <Save />
              </ListItemIcon>
              <ListItemText primary="Salvar arquivo de templates" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
}
