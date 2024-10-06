import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const Countdown = ({ initialTime, currentTime, onComplete, isPaused, onTimeUpdate, isCollapsed, isTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(currentTime || initialTime);

  useEffect(() => {
    setTimeLeft(currentTime || initialTime);
  }, [currentTime, initialTime]);

  useEffect(() => {
    let timer;
    if (!isPaused && timeLeft > 0 && !isTimeUp) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1000;
          onTimeUpdate(newTime);
          if (newTime <= 0) {
            clearInterval(timer);
            onComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPaused, onComplete, onTimeUpdate, isTimeUp]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isCollapsed) {
    return null; // Don't render anything when collapsed
  }

  return (
    <Box sx={{ fontSize: '2rem', textAlign: 'center' }}>
      {formatTime(timeLeft)}
    </Box>
  );
};

export default Countdown;
