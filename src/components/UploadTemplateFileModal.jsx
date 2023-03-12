import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import buildTemplatesRepository from "../repositoy"

const templatesRepository = buildTemplatesRepository()

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function UploadTemplateFileModal(props) {
  const [file, setFile] = React.useState("");
  const [open] = props.openState
  const handleOpen = props.handleOpen

  function handleChange(e) {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      setFile(e.target.result);
    };
  }

  function useFile() {
    templatesRepository.saveTemplateFile("old", file)
    templatesRepository.saveTemplateFile("default", file)
    handleOpen(false)
    window.location.reload(false);
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
            Adicionar ou substituir arquivo de templates
          </Typography>
          <input type="file" onChange={handleChange} />
          <Button variant="contained" onClick={() => useFile()}>Usar arquivo</Button>
        </Box>
      </Modal>
    </div>
  );
}