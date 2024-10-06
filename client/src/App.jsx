import Box from "@mui/material/Box";
import NavBar from "./components/navbar";
import { Typography } from "@mui/material";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import KanbanBoard from "./components/KanbanBoard.jsx";
import UploadFile from "./components/UploadFile.jsx";

function App() {
  const [isTasksMenuOpen, setTasksMenuOpen] = useState(true);
  const [isCalendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [aiData, setAiData] = useState(null);

  const toggleMenus = (open, id) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    switch (id) {
      case "Tasks":
        setTasksMenuOpen(open);
        setCalendarMenuOpen(false);
        setProfileMenuOpen(false);
        setSettingsMenuOpen(false);
        break;
      case "Calendar":
        setCalendarMenuOpen(open);
        setTasksMenuOpen(false);
        setProfileMenuOpen(false);
        setSettingsMenuOpen(false);
        break;
      case "Profile":
        setProfileMenuOpen(open);
        setCalendarMenuOpen(false);
        setTasksMenuOpen(false);
        setSettingsMenuOpen(false);
        break;
      case "Settings":
        setSettingsMenuOpen(open);
        setCalendarMenuOpen(false);
        setTasksMenuOpen(false);
        setProfileMenuOpen(false);
        break;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <NavBar toggleMenus={toggleMenus} aiData={aiData}/>
      <Box component="main" sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Box sx={[
          { 
            pt: 8,
            width: '100%', // Ensure full width
            boxSizing: 'border-box', // Include padding in width calculation
          },
          !isTasksMenuOpen && { display: "none" }
        ]}>
          <KanbanBoard setAiData={setAiData} aiData={aiData} />
        </Box>
        <Box
          sx={[!isCalendarMenuOpen && { display: "none" }]}
        >
          <UploadFile setAiData={setAiData} aiData={aiData} />
        </Box>
        <Box
          fontSize={500}
          sx={[!isProfileMenuOpen && { display: "none" }]}
        >
          Profile
        </Box>
        <Box
          fontSize={500}
          sx={[!isSettingsMenuOpen && { display: "none" }]}
        >
          Settings
        </Box>
      </Box>
    </Box>
  );
}

export default App;
