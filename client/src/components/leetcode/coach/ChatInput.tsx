import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  PlusCircle,
  Send,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Search,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import ModelSelect from "@/components/llm/ModelSelect";
import { Model } from "@/config/config";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  extraClasses?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  isLoading = false,
  extraClasses,
}) => {
  const [activeToolPanelOpen, setActiveToolPanelOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
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
                          selectedTool === "explanation" ? "default" : "outline"
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
                  {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)}
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

      {/* Bottom section with prompt suggestions and model selector */}
      <div className="flex justify-between items-center mt-3">
        {/* Prompt suggestions */}
        <div className="flex gap-2 overflow-x-auto pb-2">
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
        </div>

        {/* Model selector */}
        <div className="flex-shrink-0">
          <ModelSelect onModelSelect={setSelectedModel} />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
