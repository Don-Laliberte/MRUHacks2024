import Box from "@mui/material/Box";
import NavBar from "./components/NavBar";
import { useState, useRef } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import KanbanBoard from "./components/board/KanbanBoard.jsx";
import TimerManager from "./components/timer/TimerManager.jsx";

function App() {
  const [isTasksMenuOpen, setTasksMenuOpen] = useState(true);
  const [isCalendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [aiData, setAiData] = useState([]);
  const timerManagerRef = useRef();

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

  const addTimer = () => {
    if (timerManagerRef.current) {
      timerManagerRef.current.addTimer();
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      console.log("No file selected");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    
    axios
      .post("http://localhost:3000/api/upload", fd)
      .then((response) => {
        console.log(response.data);
        setAiData([...response.data]);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });


      axios.post("http://localhost:3000/api/gptresponse", fd)
      .then((response) => {
        console.log(response.data)
      })
      
 
  };


  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <NavBar toggleMenus={toggleMenus} aiData={aiData} addTimer={addTimer} />

      <Box component="main" sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Box
          sx={[
            {
              pt: 8,
              width: "100%", // Ensure full width
              boxSizing: "border-box", // Include padding in width calculation
            },
            !isTasksMenuOpen && { display: "none" },
          ]}
        >
          <KanbanBoard aiData={aiData} />
        </Box>
        <Box sx={[!isCalendarMenuOpen && { display: "none" }]}>
          <>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button type="submit">Submit</button>
            </form>
          </>
        </Box>
        <Box fontSize={500} sx={[!isProfileMenuOpen && { display: "none" }]}>
          Profile
        </Box>
        <Box fontSize={500} sx={[!isSettingsMenuOpen && { display: "none" }]}>
          Settings
        </Box>
      </Box>
      <TimerManager ref={timerManagerRef} />
    </Box>
  );
}

export default App;
