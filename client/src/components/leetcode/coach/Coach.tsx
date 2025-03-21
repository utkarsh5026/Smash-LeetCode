import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Lightbulb,
  BookOpen,
  Search,
  MessageSquare,
  Bot,
  Sparkles,
  ChevronRight,
  PlusCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ModelSelect from "@/components/llm/ModelSelect";

// Types for our component
const InteractiveCoach = ({
  selectedModel,
  setSelectedModel,
  problemName,
  problemDifficulty,
  problemTags,
}) => {
  const [messages, setMessages] = useState([
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
  const [activeToolPanelOpen, setActiveToolPanelOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const scrollAreaRef = useRef(null);
  const textareaRef = useRef(null);

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
    const newUserMessage = {
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
      let responseType = "general";
      let responseContent = "";

      if (selectedTool === "hint") {
        responseType = "hint";
        responseContent =
          "Let's think about this step by step. Have you considered using a hash map to store values as you iterate through the array? This would allow O(1) lookups.";
      } else if (selectedTool === "question") {
        responseType = "question";
        responseContent =
          "What's the time complexity of your current approach? Is there a way we could optimize it further?";
      } else if (selectedTool === "explanation") {
        responseType = "explanation";
        responseContent =
          "This problem is a classic application of the two-pointer technique. It works by maintaining two pointers that move toward each other from opposite ends of a sorted array. Here's why it works...";
      } else if (selectedTool === "debug") {
        responseType = "debug";
        responseContent =
          "I noticed you're not handling the edge case where the array is empty. Consider adding a check at the beginning of your function to return an appropriate value in that case.";
      } else {
        responseContent =
          "I see your approach. Have you considered the edge cases? What happens when the input contains duplicate values?";
      }

      const newCoachMessage = {
        id: Date.now().toString(),
        type: "coach",
        content: responseContent,
        timestamp: new Date(),
        model: selectedModel,
        messageType: responseType,
      };

      setMessages((prev) => [...prev, newCoachMessage]);
      setIsTyping(false);
      setSelectedTool(null);
      setActiveToolPanelOpen(false);
    }, 1500);
  };

  // Handle textarea key events (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-grow textarea as user types
  const handleTextareaChange = (e) => {
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
  const getMessageStyle = (message) => {
    if (message.type === "user") {
      return "bg-primary/90 text-primary-foreground";
    }

    switch (message.messageType) {
      case "hint":
        return "bg-amber-500/10 border border-amber-500/30 text-amber-100";
      case "question":
        return "bg-sky-500/10 border border-sky-500/30 text-sky-100";
      case "explanation":
        return "bg-indigo-500/10 border border-indigo-500/30 text-indigo-100";
      case "debug":
        return "bg-rose-500/10 border border-rose-500/30 text-rose-100";
      default:
        return "bg-zinc-800/90 border border-zinc-700/50 text-zinc-100";
    }
  };

  // Get icon for message type
  const getMessageIcon = (messageType) => {
    switch (messageType) {
      case "hint":
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case "question":
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case "explanation":
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case "debug":
        return <Search className="w-4 h-4 text-rose-400" />;
      default:
        return <Bot className="w-4 h-4 text-primary" />;
    }
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    // Auto-focus the textarea after selecting a tool
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  return (
    <Card className="w-full bg-zinc-900/95 border-zinc-800 overflow-hidden shadow-xl rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/70">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              AI Coding Coach
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge className={`${getDifficultyColor()} text-xs`}>
                {problemDifficulty}
              </Badge>
              <span className="text-xs text-zinc-400">{problemName}</span>
            </div>
          </div>
        </div>

        <ModelSelect onModelSelect={setSelectedModel} />
      </div>

      {/* Chat Messages */}
      <ScrollArea className="h-[400px]" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4 p-4">
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
                className={`max-w-[80%] rounded-xl p-4 shadow-md ${getMessageStyle(
                  message
                )}`}
              >
                {message.type === "coach" && message.messageType && (
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-zinc-700/30">
                    {getMessageIcon(message.messageType)}
                    <span className="text-xs font-medium">
                      {message.messageType === "general"
                        ? "Coach"
                        : message.messageType.charAt(0).toUpperCase() +
                          message.messageType.slice(1)}
                    </span>
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <div className="flex justify-end mt-2 pt-1">
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
              <div className="bg-zinc-800/80 border border-zinc-700/50 max-w-[80%] rounded-xl p-4 shadow-md">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <div className="flex space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-primary/60 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-primary/60 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.3,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-primary/60 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.5,
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

      {/* Input Area with Tool Selection */}
      <div className="p-4 border-t border-zinc-800/70">
        <AnimatePresence>
          {activeToolPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 overflow-hidden"
            >
              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg border border-zinc-700/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-zinc-300">
                    Choose a coaching tool
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-100"
                    onClick={() => setActiveToolPanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="mb-3 bg-zinc-700/50" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            selectedTool === "hint" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleToolSelect("hint")}
                          className={`w-full justify-start ${
                            selectedTool === "hint"
                              ? "bg-amber-600/90 hover:bg-amber-700 text-amber-50"
                              : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700/80 text-amber-200"
                          }`}
                        >
                          <Lightbulb
                            className={`w-4 h-4 mr-2 ${
                              selectedTool === "hint"
                                ? "text-amber-200"
                                : "text-amber-400"
                            }`}
                          />
                          <span>Hint</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get a gentle hint without spoilers</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            selectedTool === "question" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleToolSelect("question")}
                          className={`w-full justify-start ${
                            selectedTool === "question"
                              ? "bg-sky-600/90 hover:bg-sky-700 text-sky-50"
                              : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700/80 text-sky-200"
                          }`}
                        >
                          <MessageSquare
                            className={`w-4 h-4 mr-2 ${
                              selectedTool === "question"
                                ? "text-sky-200"
                                : "text-sky-400"
                            }`}
                          />
                          <span>Questions</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get guiding questions to develop your thinking</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            selectedTool === "explanation"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleToolSelect("explanation")}
                          className={`w-full justify-start ${
                            selectedTool === "explanation"
                              ? "bg-indigo-600/90 hover:bg-indigo-700 text-indigo-50"
                              : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700/80 text-indigo-200"
                          }`}
                        >
                          <BookOpen
                            className={`w-4 h-4 mr-2 ${
                              selectedTool === "explanation"
                                ? "text-indigo-200"
                                : "text-indigo-400"
                            }`}
                          />
                          <span>Concepts</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Learn about algorithms and concepts for this problem
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            selectedTool === "debug" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleToolSelect("debug")}
                          className={`w-full justify-start ${
                            selectedTool === "debug"
                              ? "bg-rose-600/90 hover:bg-rose-700 text-rose-50"
                              : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700/80 text-rose-200"
                          }`}
                        >
                          <Search
                            className={`w-4 h-4 mr-2 ${
                              selectedTool === "debug"
                                ? "text-rose-200"
                                : "text-rose-400"
                            }`}
                          />
                          <span>Debug</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get help finding bugs in your code</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {selectedTool && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 rounded-lg bg-zinc-800/70 border border-zinc-700/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getMessageIcon(selectedTool)}
                      <span className="text-sm font-medium text-zinc-200">
                        {selectedTool.charAt(0).toUpperCase() +
                          selectedTool.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300">
                      {selectedTool === "hint" &&
                        "What specific part of the problem are you stuck on?"}
                      {selectedTool === "question" &&
                        "What approach are you considering? I'll help guide your thinking."}
                      {selectedTool === "explanation" &&
                        "Which concept would you like me to explain for this problem?"}
                      {selectedTool === "debug" &&
                        "Paste your code and tell me what's not working as expected."}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <div className="flex items-center mb-2">
            {selectedTool && (
              <div className="flex items-center mr-2">
                <Badge
                  className={
                    selectedTool === "hint"
                      ? "bg-amber-600/30 text-amber-200 border-amber-500/50"
                      : selectedTool === "question"
                      ? "bg-sky-600/30 text-sky-200 border-sky-500/50"
                      : selectedTool === "explanation"
                      ? "bg-indigo-600/30 text-indigo-200 border-indigo-500/50"
                      : "bg-rose-600/30 text-rose-200 border-rose-500/50"
                  }
                >
                  {getMessageIcon(selectedTool)}
                  <span className="ml-1">
                    {selectedTool.charAt(0).toUpperCase() +
                      selectedTool.slice(1)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSelectedTool(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            )}
            {!activeToolPanelOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveToolPanelOpen(true)}
                className="text-xs h-7 px-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                <span>Tools</span>
              </Button>
            )}
          </div>

          <Textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedTool
                ? `Ask about ${
                    selectedTool === "hint"
                      ? "what part you're stuck on..."
                      : selectedTool === "question"
                      ? "your approach..."
                      : selectedTool === "explanation"
                      ? "concepts you'd like explained..."
                      : "your code issues..."
                  }`
                : "Ask a question or share your approach..."
            }
            className="min-h-[60px] max-h-[200px] pr-12 bg-zinc-800/50 hover:bg-zinc-800/70 focus:bg-zinc-800/90 border-zinc-700/50 focus:border-primary/30 focus:ring-primary/20 resize-none placeholder-zinc-500 transition-colors duration-200 text-zinc-100"
            disabled={isTyping}
          />

          <Button
            type="submit"
            size="sm"
            disabled={!userInput.trim() || isTyping}
            onClick={handleSendMessage}
            className={`absolute right-3 bottom-3 h-8 px-3 transition-all duration-200 ${
              userInput.trim() && !isTyping
                ? "bg-primary hover:bg-primary/90"
                : "bg-zinc-700 hover:bg-zinc-600"
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Prompt suggestions */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserInput("How do I approach this problem?")}
            className="whitespace-nowrap text-xs py-1 px-3 h-auto bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <ChevronRight className="h-3 w-3 mr-1" />
            How do I approach this?
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserInput("What's the optimal time complexity?")}
            className="whitespace-nowrap text-xs py-1 px-3 h-auto bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <ChevronRight className="h-3 w-3 mr-1" />
            Optimal time complexity?
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserInput("Can you explain dynamic programming?")}
            className="whitespace-nowrap text-xs py-1 px-3 h-auto bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <ChevronRight className="h-3 w-3 mr-1" />
            Explain dynamic programming
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveCoach;
