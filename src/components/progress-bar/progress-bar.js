import React, { useEffect, useState } from "react";
// import closeBut from './closeBut.svg';
import './progress-bar.css';

const ProgressBar = ({ size, strokeWidth, percentage, color }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(percentage);
  }, [percentage]);

  const viewBox = `0 0 ${size} ${size}`;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (progress * circumference) / 100;

  return (
    <div className='progress-bar-wrapper'>
        <svg width={size} height={size} viewBox={viewBox}>
        <circle
            fill="none"
            stroke="#2b2a2a"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
        />
        <circle
            fill="none"
            stroke={color}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeDasharray={[dash, circumference - dash]}
            strokeLinecap="round"
            style={{ transition: "all 0.5s" }}
        />
        </svg>
    </div>
  );
};

export default ProgressBar;
