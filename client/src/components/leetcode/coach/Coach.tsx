import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Lightbulb,
  Code,
  Search,
  BookOpen,
  Sparkles,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Model } from "@/config/config";
import ModelSelect from "@/components/llm/ModelSelect";

// Types for our component
interface CoachMessage {
  id: string;
  type: "user" | "coach";
  content: string;
  timestamp: Date;
  model?: Model;
  messageType?: "hint" | "question" | "explanation" | "debug" | "general";
}

interface InteractiveCoachProps {
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  problemName: string;
  problemDifficulty: string;
  problemTags: string[];
}

const InteractiveCoach: React.FC<InteractiveCoachProps> = ({
  selectedModel,
  setSelectedModel,
  problemName,
  problemDifficulty,
  problemTags,
}) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: "1",
      type: "coach",
      content: `Let's solve the "${problemName}" problem together! This is a ${problemDifficulty.toLowerCase()} level problem about ${problemTags.join(
        ", "
      )}. How would you like to start?`,
      timestamp: new Date(),
      model: selectedModel,
      messageType: "general",
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage: CoachMessage = {
      id: Date.now().toString(),
      type: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsTyping(true);

    // Auto-resize textarea back to default
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      let responseType:
        | "hint"
        | "question"
        | "explanation"
        | "debug"
        | "general" = "general";
      let responseContent = "";

      if (activeTool === "hint") {
        responseType = "hint";
        responseContent =
          "Let's think about this step by step. Have you considered using a hash map to store values as you iterate through the array? This would allow O(1) lookups.";
      } else if (activeTool === "question") {
        responseType = "question";
        responseContent =
          "What's the time complexity of your current approach? Is there a way we could optimize it further?";
      } else if (activeTool === "explanation") {
        responseType = "explanation";
        responseContent =
          "This problem is a classic application of the two-pointer technique. It works by maintaining two pointers that move toward each other from opposite ends of a sorted array. Here's why it works...";
      } else if (activeTool === "debug") {
        responseType = "debug";
        responseContent =
          "I noticed you're not handling the edge case where the array is empty. Consider adding a check at the beginning of your function to return an appropriate value in that case.";
      } else {
        responseContent =
          "I see your approach. Have you considered the edge cases? What happens when the input contains duplicate values?";
      }

      const newCoachMessage: CoachMessage = {
        id: Date.now().toString(),
        type: "coach",
        content: responseContent,
        timestamp: new Date(),
        model: selectedModel,
        messageType: responseType,
      };

      setMessages((prev) => [...prev, newCoachMessage]);
      setIsTyping(false);
      setActiveTool(null);
    }, 1500);
  };

  // Handle textarea key events (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-grow textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Get color based on difficulty
  const getDifficultyColor = () => {
    switch (problemDifficulty) {
      case "Easy":
        return "bg-green-500 text-green-100";
      case "Medium":
        return "bg-yellow-500 text-yellow-100";
      case "Hard":
        return "bg-red-500 text-red-100";
      default:
        return "bg-blue-500 text-blue-100";
    }
  };

  // Get message style based on type
  const getMessageStyle = (message: CoachMessage) => {
    if (message.type === "user") {
      return "bg-primary text-primary-foreground";
    }

    switch (message.messageType) {
      case "hint":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-200";
      case "question":
        return "bg-blue-500/20 border-blue-500/30 text-blue-200";
      case "explanation":
        return "bg-indigo-500/20 border-indigo-500/30 text-indigo-200";
      case "debug":
        return "bg-red-500/20 border-red-500/30 text-red-200";
      default:
        return "bg-zinc-800 border-zinc-700 text-zinc-100";
    }
  };

  // Get icon for message type
  const getMessageIcon = (messageType?: string) => {
    switch (messageType) {
      case "hint":
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case "question":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "explanation":
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case "debug":
        return <Search className="w-4 h-4 text-red-400" />;
      default:
        return <Bot className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="w-full bg-zinc-900/90 border-zinc-800/50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/70 bg-zinc-900/95">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-zinc-400"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>

          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Coding Coach</h3>
              <p className="text-xs text-zinc-400">
                Powered by {selectedModel}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`${getDifficultyColor()}`}>
            {problemDifficulty}
          </Badge>
          <ModelSelect onModelSelect={setSelectedModel} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Chat Messages */}
            <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 shadow-md ${getMessageStyle(
                        message
                      )} ${message.type === "coach" ? "border" : ""}`}
                    >
                      {message.type === "coach" && message.messageType && (
                        <div className="flex items-center gap-1.5 mb-2">
                          {getMessageIcon(message.messageType)}
                          <span className="text-xs font-semibold uppercase">
                            {message.messageType === "general"
                              ? "Coach"
                              : message.messageType}
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="flex justify-end mt-1">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-zinc-800 border border-zinc-700 max-w-[80%] rounded-lg p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-2 h-2 bg-zinc-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-zinc-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: 0.3,
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-zinc-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: 0.6,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Coaching Tools */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTool === "hint" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setActiveTool(activeTool === "hint" ? null : "hint")
                      }
                      className={
                        activeTool === "hint"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700"
                      }
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      <span>Hint</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Get a gentle hint without spoilers
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        activeTool === "question" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setActiveTool(
                          activeTool === "question" ? null : "question"
                        )
                      }
                      className={
                        activeTool === "question"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700"
                      }
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>Leading Questions</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Get Socratic questions to guide your thinking
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        activeTool === "explanation" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setActiveTool(
                          activeTool === "explanation" ? null : "explanation"
                        )
                      }
                      className={
                        activeTool === "explanation"
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700"
                      }
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>Concept Explanation</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Learn about underlying algorithms and data structures
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTool === "debug" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setActiveTool(activeTool === "debug" ? null : "debug")
                      }
                      className={
                        activeTool === "debug"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700"
                      }
                    >
                      <Search className="w-4 h-4 mr-1" />
                      <span>Code Debugger</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Get help finding bugs in your code
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Input Area */}
            <CardContent className="p-4 border-t border-zinc-800/70">
              <div className="relative">
                {activeTool && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2 px-3 py-2 bg-zinc-800/80 rounded-lg border border-zinc-700/50 text-sm text-zinc-300"
                  >
                    {activeTool === "hint" &&
                      "What specific part of the problem are you stuck on?"}
                    {activeTool === "question" &&
                      "What approach are you considering? I'll help guide your thinking."}
                    {activeTool === "explanation" &&
                      "Which concept would you like me to explain for this problem?"}
                    {activeTool === "debug" &&
                      "Paste your code and tell me what's not working as expected."}
                  </motion.div>
                )}

                <Textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeTool
                      ? `Ask about ${
                          activeTool === "hint"
                            ? "a hint"
                            : activeTool === "question"
                            ? "leading questions"
                            : activeTool === "explanation"
                            ? "concepts"
                            : "debugging help"
                        }...`
                      : "Ask a question or share your approach..."
                  }
                  className="min-h-[60px] max-h-[200px] pr-24 bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700/50 focus:border-primary/30 focus:ring-primary/20 resize-none placeholder-zinc-500"
                  disabled={isTyping}
                />

                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                      <DropdownMenuItem
                        className="text-sm cursor-pointer"
                        onClick={() =>
                          setUserInput(
                            (prev) =>
                              prev + "\n```python\n# Your code here\n```"
                          )
                        }
                      >
                        Insert Python Code Block
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-sm cursor-pointer"
                        onClick={() =>
                          setUserInput(
                            (prev) =>
                              prev + "\n```javascript\n// Your code here\n```"
                          )
                        }
                      >
                        Insert JavaScript Code Block
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-sm cursor-pointer"
                        onClick={() =>
                          setUserInput(
                            (prev) => prev + "\n```java\n// Your code here\n```"
                          )
                        }
                      >
                        Insert Java Code Block
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={!userInput.trim() || isTyping}
                    onClick={handleSendMessage}
                    className={`h-8 px-3 transition-all duration-200 ${
                      userInput.trim() && !isTyping
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-zinc-700 hover:bg-zinc-600"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default InteractiveCoach;
