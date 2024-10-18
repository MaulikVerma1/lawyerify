import React from 'react';

interface ProgressSliderProps {
  label: string;
  correct: number;
  total: number;
}

export function ProgressSlider({ label, correct, total }: ProgressSliderProps) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0;
  const incorrectPercentage = total > 0 ? ((total - correct) / total) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{correct}/{total} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div className="flex h-full">
          <div 
            className="bg-green-600 h-full"
            style={{ width: `${correctPercentage}%` }}
          ></div>
          <div 
            className="bg-red-600 h-full"
            style={{ width: `${incorrectPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
