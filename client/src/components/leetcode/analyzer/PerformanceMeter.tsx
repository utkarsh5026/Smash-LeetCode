import React from "react";
import { getScoreColor } from "./colors";

interface PerformanceMeterProps {
  value: number;
  label: string;
}

const PerformanceMeter: React.FC<PerformanceMeterProps> = ({
  value,
  label,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#27272a"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke={`hsl(${value * 1.2}, 100%, 60%)`}
            strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 40 * (value / 100)} ${
              2 * Math.PI * 40 * (1 - value / 100)
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${getScoreColor(value)}`}>
            {value}
          </span>
        </div>
      </div>
      <span className="text-sm text-zinc-400 mt-1">{label}</span>
    </div>
  );
};

export default PerformanceMeter;
