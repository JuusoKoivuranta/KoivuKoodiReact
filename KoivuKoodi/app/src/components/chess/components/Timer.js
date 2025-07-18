import React, { useEffect } from 'react';

const Timer = ({ time, className, isActive }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={className}>
      {formatTime(time)}
    </div>
  );
};

export default Timer;
