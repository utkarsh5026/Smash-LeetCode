import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Layers,
  Clock,
} from "lucide-react";

import { getComplexityColor } from "./colors";
import { Badge } from "@/components/ui/badge";
import PerformanceMeter from "./PerformanceMeter";

interface ComplexityAnalysisProps {
  complexityAnalysis: {
    time: string;
    space: string;
    timeExplanation: string;
    spaceExplanation: string;
    performance: number;
  };
}

const ComplexityAnalysis: React.FC<ComplexityAnalysisProps> = ({
  complexityAnalysis,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Time Complexity */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">Time Complexity</h3>
            <Badge
              className={`ml-auto ${getComplexityColor(
                complexityAnalysis.time
              )} bg-zinc-800`}
            >
              {complexityAnalysis.time}
            </Badge>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            {complexityAnalysis.timeExplanation}
          </p>
        </div>

        {/* Space Complexity */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-medium text-white">Space Complexity</h3>
            <Badge
              className={`ml-auto ${getComplexityColor(
                complexityAnalysis.space
              )} bg-zinc-800`}
            >
              {complexityAnalysis.space}
            </Badge>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            {complexityAnalysis.spaceExplanation}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center space-y-6">
        <PerformanceMeter
          value={complexityAnalysis.performance}
          label="Overall Score"
        />

        <div className="bg-zinc-800/60 rounded-lg p-4 border border-zinc-700/50 w-full">
          <h4 className="text-sm font-medium text-zinc-300 mb-3">
            Optimization Tips
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">
                Your time complexity is optimal
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">
                Consider using a set instead of an array for lookups
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Edge cases are well-handled</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComplexityAnalysis;
