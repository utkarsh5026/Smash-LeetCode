import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const sampleChat = [
  {
    question: "Hello, how are you?",
    answer: "I'm fine, thank you!",
  },
  {
    question: "What is the capital of France?",
    answer: "The capital of France is Paris.",
    model: models[0],
  },
  {
    question: "What is the capital of France?",
    answer: "The capital of France is Paris.",
    model: models[1],
  },
];

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
      className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6 font-cascadia-code"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="max-w-8xl mx-auto mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{problem.name}</h1>
          <motion.span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              problem.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : problem.difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {problem.difficulty}
          </motion.span>
          <span className="text-sm text-muted-foreground">
            Acceptance Rate: {problem.acceptance_rate}
          </span>
        </div>
        <motion.div whileHover={{ scale: 1.02 }}>
          <Button
            variant="outline"
            className="bg-primary/10"
            onClick={() => window.open(problem.link, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Problem
          </Button>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="max-w-8xl mx-auto grid grid-cols-2 gap-6">
        <InteractiveCoach
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          problemName={problem.name}
          problemDifficulty={problem.difficulty}
          problemTags={["Array", "Two Pointers", "Sorting"]}
        />

        <Card className="h-[calc(100vh-12rem)]">
          <CardContent className="p-4 h-full">
            <Tabs defaultValue="description" className="h-full flex flex-col">
              <TabsList>
                <TabsTrigger value="description">
                  Problem Description
                </TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="analysis">Code Analysis</TabsTrigger>
                <TabsTrigger value="visualize">Visualize</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="flex-1 mt-4">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="prose dark:prose-invert max-w-none">
                    {description}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="solution" className="flex-1 mt-4">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <CodeSegment />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="analysis" className="flex-1 mt-4">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <CodeQualityAnalyzer
                    userCode={currentCode}
                    language={"Python"}
                    problemName={problem.name}
                    problemDifficulty={problem.difficulty}
                    isAnalyzing={isAnalyzing}
                    onRunAnalysis={() => setIsAnalyzing(false)}
                  />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="visualize" className="flex-1 mt-4">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <VisualAlgorithmSimulator
                    userCode={currentCode}
                    language={"Python"}
                    problemName={problem.name}
                    problemDifficulty={problem.difficulty}
                    algorithmType={determineAlgorithmType()}
                    exampleInput={problem.example_input}
                    optimalSolution={{
                      code: problem.optimal_solution?.Python?.code || "",
                      language: "Python",
                    }}
                  />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProblemDetail;
