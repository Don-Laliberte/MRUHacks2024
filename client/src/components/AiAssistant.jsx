import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";

export default function AiAssistant({ open, toggleAiDrawer}) {

    return (
        <Drawer anchor="right" open={open} onClose={toggleAiDrawer(false)}>
          <Toolbar />
            <Typography>
                <Box>Test text</Box>
            </Typography>
        </Drawer>
      );
}
