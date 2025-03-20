import { Badge } from "@/components/ui/badge";
import { ArrowDownUp, CheckCircle2, XCircle } from "lucide-react";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import { getComplexityColor } from "./colors";

interface AlternativeApproachProps {
  alternativeApproaches: {
    name: string;
    description: string;
    complexity: { time: string; space: string };
    pros: string[];
    cons: string[];
    codeSnippet: string;
  }[];
  language: string;
}

const AlternativeApproaches: React.FC<AlternativeApproachProps> = ({
  alternativeApproaches,
  language,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {alternativeApproaches.map((approach, idx) => (
        <div
          key={idx}
          className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden"
        >
          <div className="p-4 border-b border-zinc-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4 text-indigo-400" />
                {approach.name}
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getComplexityColor(
                    approach.complexity.time
                  )} bg-zinc-800`}
                >
                  Time: {approach.complexity.time}
                </Badge>
                <Badge
                  className={`${getComplexityColor(
                    approach.complexity.space
                  )} bg-zinc-800`}
                >
                  Space: {approach.complexity.space}
                </Badge>
              </div>
            </div>
            <p className="text-zinc-300">{approach.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Pros</h4>
              <ul className="space-y-1">
                {approach.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">{pro}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-sm font-medium text-zinc-300 mt-4 mb-2">
                Cons
              </h4>
              <ul className="space-y-1">
                {approach.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-md">
              <SyntaxHighlighter
                language={language.toLowerCase()}
                style={vs2015}
                className="h-full"
              >
                {approach.codeSnippet}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlternativeApproaches;
