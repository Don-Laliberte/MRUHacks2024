import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useState } from "react";
import AiAssistant from "./AiAssistant";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function NavBar({toggleMenus}) {
  const [isMenuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [isAiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [isTimerModelOpen, setTimerModalOpen] = useState(false);


  const toggleMenuDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setMenuDrawerOpen((open) => !open);
  };

  const toggleTimerModal = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setTimerModalOpen((open) => !open);
  };

  const toggleAiDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setAiDrawerOpen((open) => !open);
  };


  const menuItems = [
    { text: "Tasks", icon: <PendingActionsIcon  /> , buttonHandler:toggleMenus(true, "Tasks")},
    { text: "Calendar", icon: <CalendarMonthIcon  />, buttonHandler:toggleMenus(true, "Calendar")},
    { text: "Profile", icon: <PersonIcon  />, buttonHandler:toggleMenus(true, "Profile")},
    { text: "Settings", icon: <SettingsIcon  /> , buttonHandler:toggleMenus(true, "Settings")},
    { text: "Timer", icon: <BrowseGalleryIcon />, buttonHandler:toggleTimerModal(true, "Timer"),},
    { text: "Productivity Assistant", icon: <PsychologyAltIcon />, buttonHandler:toggleAiDrawer(true, "Ai"),},
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleMenuDrawer(false)}
      onKeyDown={toggleMenuDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button onClick={item.buttonHandler} key={item.text}>
            <ListItemIcon  >
              {item.icon}
            </ListItemIcon>
            <ListItemText  primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar color="purple">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleMenuDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Box fontWeight={"fontWeightBold"}>bProductive</Box>
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Drawer open={isMenuDrawerOpen} onClose={toggleMenuDrawer(false)}>
        <Toolbar />
        {drawerContent}
      </Drawer>
      <AiAssistant open={isAiDrawerOpen} toggleAiDrawer={toggleAiDrawer}></AiAssistant>
    </Box>
  );
}
