import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Select,
  MenuItem,
  Toolbar,
  AppBar,
  Box,
  IconButton,
} from "@mui/material";

export default function ButtonAppBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={props.toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <div className="form-select-div">
            <Select
              labelId="templates-label"
              label="Templates"
              id="template-select"
              onChange={selectTemplate}
              value={props.selectedTemplate}
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
            >
              {props.templatesKeys.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );

  function selectTemplate({ target: { value } }) {
    if (!value) return;
    props.setSelectedTemplate(value);
    templatesRepository.saveSelectedTemplate(value);
    window.location.reload(false)
  }
}
