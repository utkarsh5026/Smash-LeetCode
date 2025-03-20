import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Syntax from "@/components/leetcode/code/Syntax";
import { Code2 } from "lucide-react";
import PerformanceMeter from "./PerformanceMeter";

interface CodeStyleProps {
  language: string;
  code: string;
  styleAnalysis: {
    score: number;
    suggestions: { line: number; type: string; description: string }[];
  };
}

const CodeStyle: React.FC<CodeStyleProps> = ({
  language,
  code,
  styleAnalysis,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <ScrollArea className="h-[400px]">
          <div className="bg-zinc-800/50 rounded-lg p-2 border border-zinc-700/50">
            <Syntax
              language={language}
              code={code}
              styleAnalysis={styleAnalysis}
            />
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <PerformanceMeter value={styleAnalysis.score} label="Style Score" />
        </div>

        <div className="bg-zinc-800/60 rounded-lg p-4 border border-zinc-700/50">
          <h4 className="text-sm font-medium text-zinc-300 mb-3">
            Style Recommendations
          </h4>
          <div className="space-y-3">
            {styleAnalysis.suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="flex gap-2 items-start pb-2 border-b border-zinc-700/30 last:border-0"
              >
                <div
                  className={`p-1 rounded-md ${
                    suggestion.type === "naming"
                      ? "bg-blue-500/20"
                      : suggestion.type === "formatting"
                      ? "bg-green-500/20"
                      : suggestion.type === "structure"
                      ? "bg-yellow-500/20"
                      : "bg-purple-500/20"
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5 text-zinc-100" />
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="text-xs font-medium text-zinc-300 capitalize">
                      {suggestion.type}
                    </p>
                    {suggestion.line && (
                      <Badge
                        className="ml-2 text-xs bg-zinc-700 hover:bg-zinc-700"
                        variant="outline"
                      >
                        Line {suggestion.line}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeStyle;
