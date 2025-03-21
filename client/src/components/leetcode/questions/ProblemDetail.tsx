import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import CodeSegment from "./CodeSegment";
import { useProblem } from "@/store/leetcode/hook";
import { models, type Model } from "@/config/config";
import InteractiveCoach from "../coach/Coach";
import CodeQualityAnalyzer from "../analyzer/CodeAnalyzer";
import VisualAlgorithmSimulator from "../visualizer/Visualizer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface ProblemDetailProps {
  problemName: string;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ problemName }) => {
  const { problemInfo, fetchProblemInfo } = useProblem();
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentCode, setCurrentCode] = useState("");

  const determineAlgorithmType = () => {
    if (!problemInfo?.problem?.tags) return "array";

    const tags = problemInfo.problem.tags.map((tag) => tag.name.toLowerCase());

    if (tags.includes("linked list")) return "linkedList";
    if (tags.includes("tree") || tags.includes("binary tree")) return "tree";
    if (tags.includes("graph")) return "graph";
    if (tags.includes("hash table") || tags.includes("hashmap"))
      return "hashMap";
    if (tags.includes("stack")) return "stack";
    if (tags.includes("queue")) return "queue";
    if (tags.includes("heap")) return "heap";

    return "array"; // Default algorithm type
  };

  const handleSendQuestion = async () => {
    if (!newQuestion.trim()) return;
    setIsTyping(true);
    // Implement your chat API call here
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTyping(false);
    setNewQuestion("");
  };

  useEffect(() => {
    fetchProblemInfo(problemName);
  }, [problemName, fetchProblemInfo]);

  const { problem, description } = useMemo(() => {
    return {
      problem: problemInfo?.problem,
      description: problemInfo?.problem.description,
      chat: problemInfo?.chat,
      solution: problemInfo?.solution,
      model: problemInfo?.model,
    };
  }, [problemInfo]);

  if (!problem) return <div>Loading...</div>;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-6 font-cascadia-code"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Content Grid - Now takes full height */}
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-2rem)]">
        <InteractiveCoach
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          problemName={problem.name}
          problemDifficulty={problem.difficulty}
          problemTags={
            problem.tags?.map((tag) => tag.name) || [
              "Array",
              "Two Pointers",
              "Sorting",
            ]
          }
        />

        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <Tabs defaultValue="description" className="h-full flex flex-col">
              <TabsList className="px-4 pt-4 bg-card">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="visualize">Visualize</TabsTrigger>
              </TabsList>

              <TabsContent
                value="description"
                className="flex-1 p-0 m-0 h-full overflow-hidden"
              >
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Problem Header - Now inside the description tab */}
                  <div className="p-4 bg-zinc-900/70 border-b border-zinc-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {problem.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${
                            problem.difficulty === "Easy"
                              ? "bg-green-500/30 text-green-300 border-green-500/40"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-500/30 text-yellow-300 border-yellow-500/40"
                              : "bg-red-500/30 text-red-300 border-red-500/40"
                          } px-3 py-1`}
                        >
                          {problem.difficulty}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-primary/10 border-primary/20 hover:bg-primary/20"
                          onClick={() => window.open(problem.link, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          LeetCode
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-sm text-zinc-300">
                        Acceptance Rate:{" "}
                        <span className="text-primary">
                          {problem.acceptance_rate}%
                        </span>
                      </span>
                      <div className="flex flex-wrap gap-1 ml-2">
                        {problem.tags?.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50 text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description Content */}
                  <ScrollArea className="flex-1 overflow-auto">
                    <div className="p-4">
                      <div className="prose dark:prose-invert max-w-none">
                        {description}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent
                value="solution"
                className="flex-1 p-0 m-0 h-full overflow-hidden"
              >
                <CodeSegment />
              </TabsContent>

              <TabsContent
                value="analysis"
                className="flex-1 p-0 m-0 h-full overflow-hidden"
              >
                <CodeQualityAnalyzer
                  userCode={
                    currentCode ||
                    "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
                  }
                  language={"Python"}
                  problemName={problem.name}
                  problemDifficulty={problem.difficulty}
                  isAnalyzing={isAnalyzing}
                  onRunAnalysis={() => setIsAnalyzing(false)}
                />
              </TabsContent>

              <TabsContent
                value="visualize"
                className="flex-1 p-0 m-0 h-full overflow-hidden"
              >
                <VisualAlgorithmSimulator
                  userCode={
                    currentCode ||
                    "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
                  }
                  language={"Python"}
                  problemName={problem.name}
                  problemDifficulty={problem.difficulty}
                  algorithmType={determineAlgorithmType()}
                  exampleInput={problem.example_input || [[2, 7, 11, 15], 9]}
                  optimalSolution={{
                    code:
                      problem.optimal_solution?.Python?.code ||
                      "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
                    language: "Python",
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProblemDetail;
