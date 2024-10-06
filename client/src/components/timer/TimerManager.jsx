import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Box } from '@mui/material';
import CountdownModal from './CountdownModal';

const TimerManager = forwardRef((props, ref) => {
  const [timers, setTimers] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useImperativeHandle(ref, () => ({
    addTimer: () => {
      const newTimer = { 
        id: Date.now(), 
        isOpen: true,
        isCollapsed: false,
        position: { 
          x: Math.max(viewportWidth - 350, 0), // 350px is an estimated width of the timer
          y: timers.length * 60 + 80 // 80px offset from top, 60px between timers
        }
      };
      setTimers(prevTimers => [...prevTimers, newTimer]);
    }
  }));

  const removeTimer = (id) => {
    setTimers(prevTimers => prevTimers.filter(timer => timer.id !== id));
  };

  const toggleTimer = (id) => {
    setTimers(prevTimers => prevTimers.map(timer => 
      timer.id === id ? { ...timer, isCollapsed: !timer.isCollapsed } : timer
    ));
  };

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      {timers.map((timer) => (
        <CountdownModal
          key={timer.id}
          open={timer.isOpen}
          onClose={() => removeTimer(timer.id)}
          isCollapsed={timer.isCollapsed}
          onToggle={() => toggleTimer(timer.id)}
          initialPosition={timer.position}
        />
      ))}
    </Box>
  );
});

export default TimerManager;
