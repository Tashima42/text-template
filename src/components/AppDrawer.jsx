import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { TextSnippet, AccountTree, AddCircle, Save } from '@mui/icons-material';

export default function AppDrawer(props) {
  const [drawer] = props.drawerState
  const toggleDrawer = props.toggleDrawer

  return (
    <React.Fragment>
        <Drawer
          open={drawer}
          onClose={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <TextSnippet />
                </ListItemIcon>
                <ListItemText primary="Editor de select" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <AccountTree />
                </ListItemIcon>
                <ListItemText primary="Editor de template" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <AddCircle />
                </ListItemIcon>
                <ListItemText primary="Novo arquivo de templates" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <Save />
                </ListItemIcon>
                <ListItemText primary="Salvar arquivo de templates" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
    </React.Fragment>
  )
}