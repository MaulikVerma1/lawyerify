import React from 'react';

interface ProgressSliderProps {
  label: string;
  correct: number;
  total: number;
}

export function ProgressSlider({ label, correct, total }: ProgressSliderProps) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0;

  const size = 100;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = (correctPercentage / 100) * circumference;

  return (
    <div className="flex items-center mb-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mr-4">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ef4444"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          strokeDasharray={`${strokeDasharray} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-xs font-bold"
        >
          {percentage}%
        </text>
      </svg>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-gray-500">{correct}/{total}</div>
      </div>
    </div>
  );
}
