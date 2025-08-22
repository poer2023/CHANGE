import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  expiresAt: string;
  onExpire?: () => void;
  className?: string;
}

const Countdown: React.FC<CountdownProps> = ({ expiresAt, onExpire, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const expireTime = new Date(expiresAt).getTime();
      const remaining = Math.max(0, expireTime - now);
      
      setTimeLeft(remaining);
      
      if (remaining === 0 && !isExpired) {
        setIsExpired(true);
        onExpire?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, isExpired, onExpire]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isExpired || timeLeft === 0) {
    return (
      <div className={`flex items-center gap-1 text-red-600 ${className}`}>
        <Clock className="h-3 w-3" />
        <span className="text-xs font-medium">已过期</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 text-amber-600 ${className}`}>
      <Clock className="h-3 w-3" />
      <span className="text-xs font-medium">
        剩余 {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default Countdown;