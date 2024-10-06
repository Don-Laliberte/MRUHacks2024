import Box from "@mui/material/Box";
import NavBar from "./components/navbar";
import { Typography } from "@mui/material";
import { useState } from "react";


function App() {
  const [isTasksMenuOpen, setTasksMenuOpen] = useState(true);
  const [isCalendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setSettingsMenuOpen] = useState(false);


  const toggleMenus = (open, id) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    switch(id) {
      case "Tasks":
        setTasksMenuOpen((open));
        setCalendarMenuOpen((false));
        setProfileMenuOpen((false));
        setSettingsMenuOpen((false));
        break;
      case "Calendar":
        setCalendarMenuOpen((open));
        setTasksMenuOpen((false));
        setProfileMenuOpen((false));
        setSettingsMenuOpen((false));
        break;
      case "Profile":
        setProfileMenuOpen((open));
        setCalendarMenuOpen((false));
        setTasksMenuOpen((false));
        setSettingsMenuOpen((false));
        break;
      case "Settings":
        setSettingsMenuOpen((open));
        setCalendarMenuOpen((false));
        setTasksMenuOpen((false));
        setProfileMenuOpen((false));
        break;
    }
  };

  return (
    <Box>
      <NavBar toggleMenus = {toggleMenus} ></NavBar>
      <Typography>
        <Box fontSize={500} sx={[!isTasksMenuOpen && { display:'none'}]}>
          Tasks
        </Box>
        <Box fontSize={500} sx={[!isCalendarMenuOpen && { display:'none'}]}>
          Calendar
        </Box>
        <Box fontSize={500} sx={[!isProfileMenuOpen && { display:'none'}]}>
          Profile
        </Box>
        <Box fontSize={500} sx={[!isSettingsMenuOpen && { display:'none'}]}>
          Settings
        </Box>
      </Typography>
    </Box>
  );
}

export default App;
