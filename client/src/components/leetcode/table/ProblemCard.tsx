import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { ProblemBasic } from "@/store/leetcode/type";
import LayeredCard3D from "@/components/utils/ThreeDCard";

interface ProblemCardProps {
  problem: ProblemBasic;
  index: number;
  currentPage: number;
  pageSize: number;
  isHovered: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Hard":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
};

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  index,
  currentPage,
  pageSize,
  isHovered,
}) => {
  return (
    <LayeredCard3D>
      <Card className="relative overflow-hidden dark:bg-zinc-900/50 backdrop-blur-sm border dark:border-zinc-800/50 hover:border-primary/30 transition-all duration-300">
        {/* Difficulty indicator line */}
        <div
          className={`h-1 w-full ${
            problem.difficulty === "Easy"
              ? "bg-green-500"
              : problem.difficulty === "Medium"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        ></div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-zinc-800 dark:bg-zinc-200 text-primary">
                {index + 1 + (currentPage - 1) * pageSize}
              </Badge>
              <h3 className="font-medium text-white">{problem.name}</h3>
            </div>
            <Badge className={getDifficultyColor(problem.difficulty)}>
              {problem.difficulty}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {Array.isArray(problem.tags) &&
              problem.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge
                  key={`${tag.name}-${tagIndex}`}
                  variant="outline"
                  className="bg-zinc-800/50 border-zinc-700/50 text-xs"
                >
                  {tag.name}
                </Badge>
              ))}
            {Array.isArray(problem.tags) && problem.tags.length > 3 && (
              <Badge className="bg-zinc-800/50 border-zinc-700/50 text-xs">
                <span>+{problem.tags.length - 3}</span>
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-zinc-400">
              <Activity className="w-4 h-4 inline-block mr-1 text-primary/80" />
              {problem.acceptance_rate}% success
            </div>

            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : 10,
              }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-primary"
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Solve
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Background gradient effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/5 to-indigo-500/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
      </Card>
    </LayeredCard3D>
  );
};

export default ProblemCard;
