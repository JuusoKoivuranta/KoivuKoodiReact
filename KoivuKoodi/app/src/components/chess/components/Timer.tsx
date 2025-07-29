import React, { useEffect, useState } from 'react';

interface TimerProps {
  time: number;
  className: string;
  isActive: boolean;
  onTimeUpdate?: (newTime: number) => void;
}

const Timer: React.FC<TimerProps> = ({ time, className, isActive, onTimeUpdate }) => {
  const [currentTime, setCurrentTime] = useState(time);

  useEffect(() => {
    setCurrentTime(time);
  }, [time]);

  useEffect(() => {
    let interval = null;
    
    if (isActive && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime - 1;
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, currentTime, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={className}>
      {formatTime(currentTime)}
    </div>
  );
};

export default Timer;
