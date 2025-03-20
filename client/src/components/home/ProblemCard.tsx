import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredProblems } from "./data";

const ProblemCard = () => {
  const problem =
    featuredProblems[Math.floor(Math.random() * featuredProblems.length)];

  const getDifficultyColor = () => {
    const { difficulty } = problem;
    if (difficulty === "Easy")
      return {
        bg: "bg-green-500",
        text: "text-green-400",
      };
    else if (difficulty === "Medium")
      return {
        bg: "bg-yellow-500",
        text: "text-yellow-400",
      };
    return {
      bg: "bg-red-500",
      text: "text-red-400",
    };
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-primary/10 overflow-hidden group hover:border-primary/30 transition-all duration-300">
      <div className={`h-1 w-full ${getDifficultyColor().bg}`}></div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-secondary/50">{problem.id}</Badge>
              <h3 className="font-medium">{problem.name}</h3>
            </div>
            <div className="flex gap-1 mt-2">
              {problem.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Badge
            className={`${getDifficultyColor().bg} ${
              getDifficultyColor().text
            }`}
          >
            {problem.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {problem.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 text-yellow-400" />
            <span>{problem.rating}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Acceptance: {problem.acceptance}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Solve Now
          <ArrowUpRight className="w-3 h-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;
