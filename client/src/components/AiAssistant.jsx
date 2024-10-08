import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";
import Markdown from "react-markdown";
import Box from "@mui/material/Box";

export default function AiAssistant({ open, toggleAiDrawer, aiChat }) {

  const markdownText = typeof aiChat === 'string' 
    ? aiChat 
    : Array.isArray(aiChat) 
      ? aiChat.join('')  // Join array elements without comma
      : '';
    
  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{
        width: 240, // Set your desired width
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "25%", // Also set the width for the paper element
          boxSizing: "border-box",
        },
      }}
      onClose={toggleAiDrawer(false)}
    >
      <Toolbar />
      <Typography
        variant="h5"
        gutterBottom
        component="div"
        sx={{ p: 2, pb: 0 }}
      >
        Personal Productivity Assistant
      </Typography>
      <Box>
        <Typography><Markdown>{`${markdownText}`}</Markdown></Typography>
      </Box>
    </Drawer>
  );
}
