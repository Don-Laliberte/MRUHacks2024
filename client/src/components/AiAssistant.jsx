import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";


export default function AiAssistant({ open, toggleAiDrawer, aiChat }) {


  return (
    <Drawer anchor="right"  open={open} 
    sx={{
      width: 240, // Set your desired width
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: "25%", // Also set the width for the paper element
        boxSizing: 'border-box',
      },
    }}
    onClose={toggleAiDrawer(false)}>
        <Toolbar />
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{ p: 2, pb: 0 }}
        >
          Personal Productivity Assistant
        </Typography>
        <List sx={{ mb: 2, width: "100%" }}>
          {/*Placeholder Text Logic*/}
          {aiChat && aiChat.map(({ id, primary, secondary }) => (
            <React.Fragment key={id}>
              {id === 1 && <ListSubheader>Today</ListSubheader>}
              {id === 3 && <ListSubheader>Yesterday</ListSubheader>}
              <ListItem>
                <ListItemText primary={primary} secondary={secondary} />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
    </Drawer>
  );
}
