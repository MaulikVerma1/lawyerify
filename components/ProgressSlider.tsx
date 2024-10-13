import React from 'react';

interface ProgressSliderProps {
  label: string;
  value: number;
  max: number;
}

export function ProgressSlider({ label, value, max }: ProgressSliderProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  const colorClass = percentage >= 70 ? 'bg-green-600' : 'bg-red-600';

  console.log(`ProgressSlider - ${label}: value=${value}, max=${max}, percentage=${percentage}`);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{value}/{max} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`h-2.5 rounded-full ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
