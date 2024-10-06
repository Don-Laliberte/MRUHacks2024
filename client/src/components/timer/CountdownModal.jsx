import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AlarmIcon from "@mui/icons-material/Alarm";
import Countdown from "./Countdown";

const style = {
  position: 'absolute',
  width: 300,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  pointerEvents: 'auto',
};

export default function CountdownModal({ open, onClose, isCollapsed, onToggle, initialPosition }) {
  const [initialTime, setInitialTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 99)) {
      setter(value);
    }
  };

  const handleStartTimer = () => {
    const totalMilliseconds = 
      (parseInt(hours) || 0) * 3600000 +
      (parseInt(minutes) || 0) * 60000 +
      (parseInt(seconds) || 0) * 1000;
    
    if (totalMilliseconds > 0) {
      setInitialTime(totalMilliseconds);
      setCurrentTime(totalMilliseconds);
      setIsPaused(false);
      setIsTimeUp(false);
    } else {
      alert("Please enter a valid time greater than zero");
    }
  };

  const handlePauseResume = () => {
    if (isTimeUp) {
      // Reset the timer to initial time
      setCurrentTime(initialTime);
      setIsTimeUp(false);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleReset = () => {
    setInitialTime(null);
    setCurrentTime(null);
    setHours('');
    setMinutes('');
    setSeconds('');
    setIsPaused(false);
    setIsTimeUp(false);
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setIsPaused(true);
  };

  const handleTimeUpdate = (newTime) => {
    setCurrentTime(newTime);
  };

  if (!open) return null;

  return (
    <Draggable defaultPosition={initialPosition} handle=".handle">
      <Box sx={{...style, width: isCollapsed ? 'auto' : 300}}>
        <Box className="handle" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isCollapsed ? 0 : 2, cursor: 'move' }}>
          {isCollapsed ? (
            <Typography variant="body1" sx={{ mr: 1 }}>
              Timer - {currentTime !== null ? formatTime(currentTime) : "00:00:00"}
            </Typography>
          ) : (
            <Typography variant="h6">Timer</Typography>
          )}
          <Box>
            <IconButton onClick={onToggle} size="small">
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {!isCollapsed && (
          <>
            {isTimeUp && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AlarmIcon color="error" sx={{ mr: 1 }} />
                <Typography color="error">Time's up!</Typography>
              </Box>
            )}
            {initialTime === null ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <TextField
                    type="number"
                    label="Hours"
                    value={hours}
                    onChange={handleInputChange(setHours)}
                    size="small"
                    sx={{ width: '30%' }}
                    inputProps={{ min: 0, max: 99 }}
                  />
                  <TextField
                    type="number"
                    label="Minutes"
                    value={minutes}
                    onChange={handleInputChange(setMinutes)}
                    size="small"
                    sx={{ width: '30%' }}
                    inputProps={{ min: 0, max: 59 }}
                  />
                  <TextField
                    type="number"
                    label="Seconds"
                    value={seconds}
                    onChange={handleInputChange(setSeconds)}
                    size="small"
                    sx={{ width: '30%' }}
                    inputProps={{ min: 0, max: 59 }}
                  />
                </Box>
                <Button onClick={handleStartTimer} variant="contained" fullWidth>
                  Start Timer
                </Button>
              </>
            ) : (
              <>
                <Countdown 
                  initialTime={initialTime}
                  currentTime={currentTime}
                  onComplete={handleTimeUp}
                  isPaused={isPaused}
                  onTimeUpdate={handleTimeUpdate}
                  isTimeUp={isTimeUp}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handlePauseResume} variant="contained" startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}>
                    {isTimeUp ? "Restart" : (isPaused ? "Resume" : "Pause")}
                  </Button>
                  <Button onClick={handleReset} variant="outlined">
                    Reset
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
        {isCollapsed && initialTime !== null && (
          <Countdown 
            initialTime={initialTime}
            currentTime={currentTime}
            onComplete={handleTimeUp}
            isPaused={isPaused}
            onTimeUpdate={handleTimeUpdate}
            isCollapsed={true}
            isTimeUp={isTimeUp}
          />
        )}
      </Box>
    </Draggable>
  );
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}