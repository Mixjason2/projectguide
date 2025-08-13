'use client';
import React, { useState, useEffect, useRef } from 'react';

const FadeButtons: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFaded, setIsFaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetFade = () => {
    setIsFaded(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsFaded(true), 2500); // 3 วินาทีไม่มี interaction -> fade
  };

  useEffect(() => {
    resetFade(); // เริ่ม timer ตอน mount
    const handleActivity = () => resetFade();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="transition-opacity duration-500"
      style={{ opacity: isFaded ? 0.01 : 1 }}
      onMouseEnter={() => setIsFaded(false)}
    >
      {children}
    </div>
  );
};

export default FadeButtons;
