import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  GitCompare,
  Eye,
  Code,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AlgorithmStep {
  id: number;
  description: string;
  codeHighlight: {
    start: number;
    end: number;
  };
  dataStructureState: any;
  variables: Record<string, any>;
  isUserSolution: boolean;
}

type AlgorithmType =
  | "array"
  | "linkedList"
  | "tree"
  | "graph"
  | "hashMap"
  | "stack"
  | "queue"
  | "heap";

interface VisualAlgorithmSimulatorProps {
  userCode: string;
  language: string;
  problemName: string;
  problemDifficulty: string;
  algorithmType?: AlgorithmType;
  exampleInput?: string;
  optimalSolution?: {
    code: string;
    language: string;
  };
  onClose?: () => void;
}

const VisualAlgorithmSimulator: React.FC<VisualAlgorithmSimulatorProps> = ({
  userCode,
  language,
  problemName,
  problemDifficulty,
  algorithmType = "array",
  exampleInput = "[1, 2, 3, 4, 5]",
  optimalSolution,
  onClose,
}) => {
  // State for visualization control
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [inputValue, setInputValue] = useState(exampleInput);
  const [activeTab, setActiveTab] = useState<
    "visualization" | "code" | "settings"
  >("visualization");

  // Animation timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Visualization container ref for resizing
  const containerRef = useRef<HTMLDivElement>(null);

  // Example visualization steps (would be generated from actual code)
  const [steps, setSteps] = useState<AlgorithmStep[]>([
    {
      id: 1,
      description: "Initialize variables and create an empty HashMap",
      codeHighlight: { start: 1, end: 3 },
      dataStructureState: {
        array: [2, 7, 11, 15],
        hashMap: {},
      },
      variables: { target: 9, i: 0 },
      isUserSolution: true,
    },
    {
      id: 2,
      description:
        "Check if complement (target - current value) exists in HashMap",
      codeHighlight: { start: 4, end: 6 },
      dataStructureState: {
        array: [2, 7, 11, 15],
        hashMap: {},
        current: 2,
        complement: 7,
      },
      variables: { target: 9, i: 0 },
      isUserSolution: true,
    },
    {
      id: 3,
      description: "Complement not found, add current value to HashMap",
      codeHighlight: { start: 7, end: 8 },
      dataStructureState: {
        array: [2, 7, 11, 15],
        hashMap: { "2": 0 },
        current: 2,
      },
      variables: { target: 9, i: 0 },
      isUserSolution: true,
    },
    {
      id: 4,
      description: "Move to next element",
      codeHighlight: { start: 3, end: 3 },
      dataStructureState: {
        array: [2, 7, 11, 15],
        hashMap: { "2": 0 },
        current: 7,
      },
      variables: { target: 9, i: 1 },
      isUserSolution: true,
    },
    {
      id: 5,
      description:
        "Check if complement (target - current value) exists in HashMap",
      codeHighlight: { start: 4, end: 6 },
      dataStructureState: {
        array: [2, 7, 11, 15],
        hashMap: { "2": 0 },
        current: 7,
        complement: 2,
        found: true,
      },
      variables: { target: 9, i: 1 },
      isUserSolution: true,
    },
    {
      id: 6,
      description: "Complement found! Return solution indices",
      codeHighlight: { start: 5, end: 5 },
      dataStructureState: {
        array: [2, 7, 11, 15],
        hashMap: { "2": 0 },
        result: [0, 1],
      },
      variables: { target: 9, i: 1 },
      isUserSolution: true,
    },
  ]);

  // Example optimal solution steps (would be generated from optimal solution code)
  const [optimalSteps, setOptimalSteps] = useState<AlgorithmStep[]>([
    // Similar structure to 'steps' but for optimal solution
    {
      id: 1,
      description: "Initialize variables and create an empty HashMap",
      codeHighlight: { start: 1, end: 3 },
      dataStructureState: {
        array: [2, 7, 11, 15],
        hashMap: {},
      },
      variables: { target: 9, i: 0 },
      isUserSolution: false,
    },
    {
      id: 2,
      description:
        "Optimized approach checks complement immediately in the loop",
      codeHighlight: { start: 4, end: 6 },
      dataStructureState: {
        array: [2, 7, 11, 15],
        hashMap: {},
        current: 2,
        complement: 7,
      },
      variables: { target: 9, i: 0 },
      isUserSolution: false,
    },
    // ... more optimal steps
  ]);

  // Simulated data for a variety of algorithm visualizations
  const getVisualizationComponent = () => {
    switch (algorithmType) {
      case "array":
        return (
          <ArrayVisualization
            data={steps[currentStepIndex].dataStructureState}
            comparisonData={
              showComparison
                ? optimalSteps[
                    Math.min(currentStepIndex, optimalSteps.length - 1)
                  ].dataStructureState
                : undefined
            }
          />
        );
      case "linkedList":
        return (
          <LinkedListVisualization
            data={steps[currentStepIndex].dataStructureState}
            comparisonData={
              showComparison
                ? optimalSteps[
                    Math.min(currentStepIndex, optimalSteps.length - 1)
                  ].dataStructureState
                : undefined
            }
          />
        );
      case "tree":
        return (
          <TreeVisualization
            data={steps[currentStepIndex].dataStructureState}
            comparisonData={
              showComparison
                ? optimalSteps[
                    Math.min(currentStepIndex, optimalSteps.length - 1)
                  ].dataStructureState
                : undefined
            }
          />
        );
      case "graph":
        return (
          <GraphVisualization
            data={steps[currentStepIndex].dataStructureState}
            comparisonData={
              showComparison
                ? optimalSteps[
                    Math.min(currentStepIndex, optimalSteps.length - 1)
                  ].dataStructureState
                : undefined
            }
          />
        );
      default:
        return (
          <ArrayVisualization
            data={steps[currentStepIndex].dataStructureState}
            comparisonData={
              showComparison
                ? optimalSteps[
                    Math.min(currentStepIndex, optimalSteps.length - 1)
                  ].dataStructureState
                : undefined
            }
          />
        );
    }
  };

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  // Handle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle step forward
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Handle step backward
  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Handle reset
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Request to generate visualization
  const handleGenerateVisualization = () => {
    // This would call an API to generate visualization data from the provided code
    console.log("Generating visualization for input:", inputValue);
    // For demo purposes, we'll just reset to the beginning
    handleReset();
  };

  return (
    <div
      ref={containerRef}
      className={`bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-xl transition-all duration-300 ${
        fullscreen ? "fixed inset-0 z-50" : "relative"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/10 p-2 rounded-md">
            <Eye className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Algorithm Visualizer
            </h3>
            <p className="text-xs text-zinc-400">
              Visualizing solution for "{problemName}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={
              problemDifficulty === "Easy"
                ? "bg-green-500/20 text-green-400"
                : problemDifficulty === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }
          >
            {problemDifficulty}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0"
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-zinc-900">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <div className="px-4 pt-4">
            <TabsList className="bg-zinc-800/50 p-1">
              <TabsTrigger
                value="visualization"
                className="data-[state=active]:bg-zinc-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualization
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-zinc-700"
              >
                <Code className="h-4 w-4 mr-2" />
                Code View
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-zinc-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Visualization Tab */}
          <TabsContent value="visualization" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Visualization Area */}
              <div className="md:col-span-2 bg-zinc-800/40 rounded-lg border border-zinc-700/50 overflow-hidden">
                <div className="p-4 border-b border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">
                      {showComparison
                        ? "Your Solution vs Optimal"
                        : "Your Solution Visualization"}
                    </h3>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowComparison(!showComparison)}
                          className={`h-8 px-2 ${
                            showComparison
                              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                              : "bg-zinc-800 border-zinc-700"
                          }`}
                        >
                          <GitCompare className="h-4 w-4 mr-1" />
                          {showComparison
                            ? "Hide Comparison"
                            : "Compare Solutions"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {showComparison
                          ? "Hide side-by-side comparison with optimal solution"
                          : "Show side-by-side comparison with optimal solution"}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="text-sm text-zinc-300">
                    Step {currentStepIndex + 1} of {steps.length}:{" "}
                    {steps[currentStepIndex].description}
                  </div>
                </div>

                <div className="h-[400px] p-4 flex items-center justify-center">
                  {getVisualizationComponent()}
                </div>
              </div>

              {/* Step Info Panel */}
              <div className="space-y-4">
                <Card className="bg-zinc-800/40 border-zinc-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Variables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(steps[currentStepIndex].variables).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center"
                          >
                            <span className="text-indigo-300 font-mono">
                              {key}:
                            </span>
                            <Badge className="bg-zinc-700/70 text-zinc-300 font-mono">
                              {JSON.stringify(value)}
                            </Badge>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/40 border-zinc-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Current Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(
                        steps[currentStepIndex].dataStructureState
                      )
                        .filter(([key]) => key !== "array" && key !== "result")
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center"
                          >
                            <span className="text-indigo-300 font-mono">
                              {key}:
                            </span>
                            <Badge className="bg-zinc-700/70 text-zinc-300 font-mono max-w-[150px] truncate">
                              {JSON.stringify(value)}
                            </Badge>
                          </div>
                        ))}

                      {steps[currentStepIndex].dataStructureState.result && (
                        <div className="flex justify-between items-center mt-4 pt-2 border-t border-zinc-700/30">
                          <span className="text-green-400 font-mono">
                            result:
                          </span>
                          <Badge className="bg-green-500/20 text-green-300 font-mono">
                            {JSON.stringify(
                              steps[currentStepIndex].dataStructureState.result
                            )}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-3 mt-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateVisualization}
                        className="h-8 px-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Regenerate visualization with new input
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="w-[200px]">
                        <h4 className="font-medium mb-1">How to use</h4>
                        <p className="text-xs">
                          Use the controls to step through the algorithm
                          execution. Compare your solution with the optimal
                          approach to learn best practices.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Code View Tab */}
          <TabsContent value="code" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 overflow-hidden">
                <div className="p-3 border-b border-zinc-700/50">
                  <h3 className="font-medium text-white">Your Solution</h3>
                </div>
                <div className="p-3 bg-black/40 h-[400px] font-mono text-sm overflow-auto">
                  <pre className="text-green-400">
                    {/* This would be syntax highlighted and show current step */}
                    {userCode}
                  </pre>
                </div>
              </div>

              <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 overflow-hidden">
                <div className="p-3 border-b border-zinc-700/50">
                  <h3 className="font-medium text-white">Optimal Solution</h3>
                </div>
                <div className="p-3 bg-black/40 h-[400px] font-mono text-sm overflow-auto">
                  <pre className="text-blue-400">
                    {/* This would be syntax highlighted optimal code */}
                    {optimalSolution?.code ||
                      "// Optimal solution code would appear here"}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-800/40 border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Visualization Settings
                  </CardTitle>
                  <CardDescription>
                    Customize how the algorithm is visualized
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-300 block">
                      Algorithm Type
                    </label>
                    <Select defaultValue={algorithmType}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-700">
                        <SelectValue placeholder="Select algorithm type" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="array">Array</SelectItem>
                        <SelectItem value="linkedList">Linked List</SelectItem>
                        <SelectItem value="tree">Tree</SelectItem>
                        <SelectItem value="graph">Graph</SelectItem>
                        <SelectItem value="hashMap">Hash Map</SelectItem>
                        <SelectItem value="stack">Stack</SelectItem>
                        <SelectItem value="queue">Queue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-zinc-700/50" />

                  <div className="space-y-2">
                    <label className="text-sm text-zinc-300 block">
                      Animation Speed
                    </label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-400">Slow</span>
                      <Slider
                        value={[speed]}
                        min={0.5}
                        max={3}
                        step={0.5}
                        onValueChange={(value) => setSpeed(value[0])}
                        className="w-full"
                      />
                      <span className="text-xs text-zinc-400">Fast</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/40 border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="text-lg">Input Configuration</CardTitle>
                  <CardDescription>
                    Set custom input for the algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-300 block">
                      Example Input
                    </label>
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter input array, e.g. [1, 2, 3, 4, 5]"
                      className="w-full h-20 bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm font-mono"
                    />
                  </div>

                  <Button
                    variant="default"
                    onClick={handleGenerateVisualization}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Visualization
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 w-8 p-0 bg-zinc-800 border-zinc-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStepBackward}
                disabled={currentStepIndex === 0}
                className="h-8 w-8 p-0 bg-zinc-800 border-zinc-700 disabled:opacity-50"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous step</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={togglePlayPause}
                className="h-8 w-8 p-0 bg-indigo-600 hover:bg-indigo-700"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStepForward}
                disabled={currentStepIndex === steps.length - 1}
                className="h-8 w-8 p-0 bg-zinc-800 border-zinc-700 disabled:opacity-50"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next step</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-200"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-zinc-500">
              <span>Start</span>
              <span>End</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-zinc-400">
          Step {currentStepIndex + 1} / {steps.length}
        </div>
      </div>
    </div>
  );
};

// Example Array Visualization Component
const ArrayVisualization: React.FC<{
  data: any;
  comparisonData?: any;
}> = ({ data, comparisonData }) => {
  if (!data || !data.array) return <div>No array data to visualize</div>;

  const array = data.array;
  const comparison = comparisonData?.array;
  const current = data.current;
  const complement = data.complement;
  const found = data.found;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <p className="text-sm text-zinc-400 mb-2">Target: {data.target || 9}</p>
        {!comparisonData ? (
          <div className="flex items-center justify-center">
            {array.map((value: any, index: number) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center m-1 rounded-md border font-mono text-lg
                  ${
                    current === value && found
                      ? "bg-green-500/30 border-green-500 text-green-300"
                      : current === value
                      ? "bg-blue-500/30 border-blue-500 text-blue-300"
                      : complement === value && !found
                      ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300"
                  }`}
              >
                {value}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-indigo-400 mb-1">Your Solution</p>
              <div className="flex items-center justify-center">
                {array.map((value: any, index: number) => (
                  <div
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center m-1 rounded-md border font-mono text-lg
                      ${
                        current === value && found
                          ? "bg-green-500/30 border-green-500 text-green-300"
                          : current === value
                          ? "bg-blue-500/30 border-blue-500 text-blue-300"
                          : complement === value && !found
                          ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                          : "bg-zinc-800 border-zinc-700 text-zinc-300"
                      }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-blue-400 mb-1">Optimal Solution</p>
              <div className="flex items-center justify-center">
                {comparison?.map((value: any, index: number) => (
                  <div
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center m-1 rounded-md border font-mono text-lg
                      ${
                        comparisonData.current === value && comparisonData.found
                          ? "bg-green-500/30 border-green-500 text-green-300"
                          : comparisonData.current === value
                          ? "bg-blue-500/30 border-blue-500 text-blue-300"
                          : comparisonData.complement === value &&
                            !comparisonData.found
                          ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                          : "bg-zinc-800 border-zinc-700 text-zinc-300"
                      }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {data.hashMap && (
        <div className="w-full max-w-md">
          <p className="text-sm text-zinc-400 mb-2 text-center">
            HashMap Contents:
          </p>
          <div className="bg-zinc-800/70 rounded-md p-3 border border-zinc-700/50">
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(data.hashMap).length === 0 ? (
                <p className="text-zinc-500 text-sm col-span-2 text-center italic">
                  Empty HashMap
                </p>
              ) : (
                Object.entries(data.hashMap).map(
                  ([key, value]: [string, any]) => (
                    <div
                      key={key}
                      className="flex justify-between text-sm bg-zinc-800 p-1 px-2 rounded"
                    >
                      <span className="text-yellow-300 font-mono">"{key}"</span>
                      <span className="text-zinc-300 font-mono">→</span>
                      <span className="text-green-300 font-mono">{value}</span>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder components for other visualization types
const LinkedListVisualization: React.FC<{
  data: any;
  comparisonData?: any;
}> = ({ data, comparisonData }) => (
  <div className="text-center text-zinc-400">
    Linked List visualization would appear here
  </div>
);

const TreeVisualization: React.FC<{
  data: any;
  comparisonData?: any;
}> = ({ data, comparisonData }) => (
  <div className="text-center text-zinc-400">
    Tree visualization would appear here
  </div>
);

const GraphVisualization: React.FC<{
  data: any;
  comparisonData?: any;
}> = ({ data, comparisonData }) => (
  <div className="text-center text-zinc-400">
    Graph visualization would appear here
  </div>
);

export default VisualAlgorithmSimulator;
