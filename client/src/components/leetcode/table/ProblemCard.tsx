import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Activity, Star } from "lucide-react";
import { ProblemBasic } from "@/store/leetcode/type";
import { useNavigate } from "react-router-dom";
import { parseLeetcodeQuestionName } from "../utils";

interface ProblemCardProps {
  problem: ProblemBasic;
  index: number;
  currentPage: number;
  pageSize: number;
  isHovered: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  index,
  currentPage,
  pageSize,
  isHovered,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/leetcode/${parseLeetcodeQuestionName(problem.name)}`);
  };

  const getDifficultyColor = () => {
    switch (problem.difficulty) {
      case "Easy":
        return "bg-green-500/30 text-green-300 border-green-500/40";
      case "Medium":
        return "bg-yellow-500/30 text-yellow-300 border-yellow-500/40";
      case "Hard":
        return "bg-red-500/30 text-red-300 border-red-500/40";
      default:
        return "bg-zinc-500/30 text-zinc-300 border-zinc-500/40";
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={`relative overflow-hidden backdrop-blur-sm border 
                   transition-all duration-300 cursor-pointer group hover:shadow-lg min-h-64
                   after:content-[''] after:absolute after:inset-0 after:opacity-0 
                   after:transition-all after:duration-200 group-hover:after:opacity-100 
                   after:transform after:translate-x-[-100%] `}
    >
      <div className="p-6 flex flex-col h-full justify-between">
        <div className="space-y-4">
          {/* Header section with problem number and difficulty */}
          <div className="flex justify-between items-start">
            <Badge className="bg-zinc-800 text-primary text-sm px-2 py-1">
              #{(currentPage - 1) * pageSize + index + 1}
            </Badge>
            <Badge
              className={`${getDifficultyColor()} ml-2 flex-shrink-0 px-3 py-1`}
            >
              {problem.difficulty}
            </Badge>
          </div>

          {/* Problem name with larger text */}
          <h3 className="font-semibold text-xl text-white leading-tight mb-2">
            {problem.name}
          </h3>

          {/* Tags section */}
          <div className="flex flex-wrap gap-2">
            {Array.isArray(problem.tags) &&
              problem.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge
                  key={`${tag.name}-${tagIndex}`}
                  variant="outline"
                  className="bg-zinc-800/70 border-zinc-700/70 text-zinc-200 text-xs"
                >
                  {tag.name}
                </Badge>
              ))}
            {Array.isArray(problem.tags) && problem.tags.length > 3 && (
              <Badge className="bg-zinc-800/70 border-zinc-700/70 text-zinc-200 text-xs">
                <span>+{problem.tags.length - 3}</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Footer section with stats and action button */}
        <div className="mt-6 pt-4 border-t border-zinc-800/70 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-300 flex items-center">
              <Activity className="w-4 h-4 mr-1 text-primary/90" />
              <span>{problem.acceptance_rate}%</span>
            </div>

            <div className="text-sm text-zinc-300 flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>

          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0.7,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center bg-primary/20 px-3 py-1.5 rounded-full text-primary-foreground"
          >
            <BookOpen className="w-4 h-4 mr-1.5 text-white" />
            <span className="text-sm font-medium text-amber-50">Solve</span>
            <ChevronRight className="w-4 h-4 ml-1 text-white" />
          </motion.div>
        </div>
      </div>
    </Card>
  );
};

export default ProblemCard;
