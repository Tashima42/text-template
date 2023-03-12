import * as React from "react";
import { 
  Button, 
  Modal, 
  TextField, 
  Typography, 
  Box 
} from "@mui/material";
import buildTemplatesRepository from "../repositoy";

const templatesRepository = buildTemplatesRepository();

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function NewTemplateModal(props) {
  const [newTemplateName, setNewTemplateName] = React.useState(null);
  const [open] = props.openState;
  const [editorTemplates] = props.editorTemplatesState;
  const handleOpen = props.handleOpen;

  function createTemplate() {
    editorTemplates[newTemplateName] = {
      baseText: "",
      options: [],
    }
    templatesRepository.saveTemplateFile("editor", JSON.stringify(editorTemplates));
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={() => handleOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Criar um novo template
          </Typography>
          <TextField onChange={(event) => setNewTemplateName(event.target.value) } placeholder="Novo template"></TextField>
          <Button className="create-button" variant="contained" onClick={createTemplate}>Criar novo template</Button>
        </Box>
      </Modal>
    </div>
  );
}
