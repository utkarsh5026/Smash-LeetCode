import React from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProblemBasic } from "@/store/leetcode/type";
import { useNavigate } from "react-router-dom";
import { parseLeetcodeQuestionName } from "../utils";

interface SleekProblemRowProps {
  problem: ProblemBasic;
  index: number;
  currentPage: number;
  pageSize: number;
  isHovered: boolean;
  onHover: (problemName: string | null) => void;
}

const SleekProblemRow: React.FC<SleekProblemRowProps> = ({
  problem,
  index,
  currentPage,
  pageSize,
  isHovered,
  onHover,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/leetcode/${parseLeetcodeQuestionName(problem.public_id)}`);
  };

  // Helper function to determine style based on difficulty
  const getDifficultyStyle = () => {
    switch (problem.difficulty) {
      case "Easy":
        return {
          bg: "bg-green-500/10",
          text: "text-green-300",
          border: "border-green-500/20",
        };
      case "Medium":
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-300",
          border: "border-yellow-500/20",
        };
      case "Hard":
        return {
          bg: "bg-red-500/10",
          text: "text-red-300",
          border: "border-red-500/20",
        };
      default:
        return {
          bg: "bg-zinc-600/10",
          text: "text-zinc-300",
          border: "border-zinc-600/20",
        };
    }
  };

  const style = getDifficultyStyle();

  return (
    <div
      className={`grid grid-cols-12 gap-4 px-6 py-4 transition-colors duration-200 ${
        isHovered ? "bg-primary/5" : "hover:bg-zinc-800/30"
      } cursor-pointer relative overflow-hidden group`}
      onClick={handleClick}
      onMouseEnter={() => onHover(problem.name)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Left border accent based on difficulty */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] ${style.bg.replace(
          "/10",
          "/30"
        )}`}
      ></div>

      {/* Problem number */}
      <div className="col-span-1 flex items-center">
        <span className="text-sm text-zinc-400">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      </div>

      {/* Problem title */}
      <div className="col-span-5 flex items-center">
        <div className="overflow-hidden">
          <div className="text-sm text-white font-medium truncate">
            {problem.name}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="col-span-3 flex items-center overflow-hidden">
        <div className="flex gap-1.5 flex-wrap">
          {Array.isArray(problem.tags) &&
            problem.tags.slice(0, 2).map((tag, tagIndex) => (
              <Badge
                key={`${tag.name}-${tagIndex}`}
                variant="outline"
                className="bg-zinc-800/50 border-zinc-700/30 text-zinc-300 text-xs px-1.5 py-0"
              >
                {tag.name}
              </Badge>
            ))}
          {Array.isArray(problem.tags) && problem.tags.length > 2 && (
            <Badge
              variant="outline"
              className="bg-zinc-800/50 border-zinc-700/30 text-zinc-400 text-xs px-1.5 py-0"
            >
              +{problem.tags.length - 2}
            </Badge>
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div className="col-span-2 flex items-center justify-center">
        <Badge
          className={`${style.bg} ${style.text} ${style.border} px-3 py-0.5`}
        >
          {problem.difficulty}
        </Badge>
      </div>

      {/* Acceptance Rate */}
      <div className="col-span-1 flex items-center justify-end">
        <span className="text-sm text-zinc-300 group-hover:text-primary transition-colors duration-200">
          {problem.acceptance_rate}%
        </span>
        <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-primary transform translate-x-[-10px] group-hover:translate-x-0" />
      </div>
    </div>
  );
};

export default SleekProblemRow;
