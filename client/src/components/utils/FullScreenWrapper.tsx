import React, { useState, useRef, ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FullscreenWrapperProps {
  children: ReactNode;
  className?: string;
  buttonClassName?: string;
  showTooltip?: boolean;
  buttonPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({
  children,
  className = "",
  buttonClassName = "",
  showTooltip = true,
  buttonPosition = "top-right",
  onFullscreenChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    if (onFullscreenChange) {
      onFullscreenChange(newState);
    }
  };

  // Determine button position classes
  const getPositionClasses = () => {
    switch (buttonPosition) {
      case "top-left":
        return "top-2 left-2";
      case "bottom-right":
        return "bottom-2 right-2";
      case "bottom-left":
        return "bottom-2 left-2";
      case "top-right":
      default:
        return "top-2 right-2";
    }
  };

  const fullscreenButton = (
    <div className={`absolute z-10 ${getPositionClasses()}`}>
      {showTooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className={`h-8 w-8 p-0 bg-zinc-800/80 border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-700 ${buttonClassName}`}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleFullscreen}
          className={`h-8 w-8 p-0 bg-zinc-800/80 border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-700 ${buttonClassName}`}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-zinc-900/95 backdrop-blur-sm overflow-auto"
          : ""
      } ${className}`}
    >
      {fullscreenButton}
      {children}
    </div>
  );
};

export default FullscreenWrapper;
