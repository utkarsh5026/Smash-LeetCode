import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  featuredProblems,
  popularTopics,
  snippets,
  features,
  difficultyLevels,
} from "./data";
import { FaGithub } from "react-icons/fa";
import ProblemCard from "./ProblemCard";

const HomePage: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState(0);
  const [floatingProblems, setFloatingProblems] = useState<JSX.Element[]>([]);

  // Create floating problem badges in the background
  useEffect(() => {
    const problems = [];
    for (let i = 0; i < 20; i++) {
      const problem =
        featuredProblems[Math.floor(Math.random() * featuredProblems.length)];
      const size = Math.random() * 1.5 + 1; // Random size between 1 and 2.5
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = Math.random() * 60 + 80; // Between 80 and 140 seconds

      problems.push(
        <motion.div
          key={i}
          className="fixed pointer-events-none select-none text-xs md:text-sm"
          style={{ top: `${top}%`, left: `${left}%` }}
          initial={{ opacity: 0.1 }}
          animate={{
            y: [0, -50, -100, -150, -200, -250],
            opacity: [0.1, 0.2, 0.3, 0.2, 0.1, 0],
            scale: [size, size, size, size, size],
          }}
          transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Badge
            className={`
            ${
              problem.difficulty === "Easy"
                ? "bg-green-500/30 text-green-200"
                : problem.difficulty === "Medium"
                ? "bg-yellow-500/30 text-yellow-200"
                : "bg-red-500/30 text-red-200"
            }
            backdrop-blur-sm opacity-40
          `}
          >
            {problem.id}. {problem.name}
          </Badge>
        </motion.div>
      );
    }
    setFloatingProblems(problems);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatVariants = {
    hover: {
      y: -10,
      transition: {
        yoyo: Infinity,
        duration: 2,
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  // Generate blur effect elements
  const renderBlurEffects = () => (
    <>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </>
  );

  return (
    <div className="bg-background min-h-screen overflow-hidden relative font-cascadia-code">
      {/* Floating problem badges in the background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
        {floatingProblems}
      </div>

      {/* Hero Section */}
      <motion.div
        className="relative pt-24 pb-16 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {renderBlurEffects()}

        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent" />
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/20"
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-secondary/20"
            animate={{ x: [0, -70, 0], y: [0, 50, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <motion.div className="text-center" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              animate={{ rotate: [0, 2, 0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-5xl">👊</span>
              <Badge className="text-lg py-1 px-4 bg-primary/10 text-primary backdrop-blur-sm">
                New Version 2.0
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
              variants={itemVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                Smash Leetcode
              </span>
            </motion.h1>

            <motion.p
              className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10"
              variants={itemVariants}
            >
              Master algorithms, solve coding challenges, and ace your technical
              interviews with our AI-powered platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white border-none"
              >
                Start Coding Now
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  window.open(
                    "https://github.com/utkarsh5026/Smash-LeetCode",
                    "_blank"
                  )
                }
                className="backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-background/80 dark:bg-background/50 dark:border-primary/20 dark:hover:bg-background/80 cursor-pointer"
              >
                <FaGithub className="mr-2 h-4 w-4 dark:text-white" />
                <span className="dark:text-white">View on GitHub</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Problem Showcase */}
          <motion.div className="mt-20 md:mt-24" variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProblemCard />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Code Preview */}
          <motion.div
            className="mt-20 flex justify-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl"
              variants={floatVariants}
              whileHover="hover"
            >
              <Card className="backdrop-blur-md bg-card/50 border border-primary/20">
                <CardContent className="p-6 overflow-hidden">
                  <div className="absolute top-2 left-4 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>

                  <div className="mb-4 mt-5 flex justify-between">
                    <div className="flex gap-2">
                      {snippets.map((snippet, i) => (
                        <Button
                          key={i}
                          variant={
                            selectedSnippet === i ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedSnippet(i)}
                          className="text-xs"
                        >
                          {snippet.language}
                        </Button>
                      ))}
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-card/50 backdrop-blur-sm"
                    >
                      {snippets[selectedSnippet].problem}
                    </Badge>
                  </div>

                  <div className="bg-black/80 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                    <pre className="whitespace-pre-wrap overflow-x-auto">
                      {snippets[selectedSnippet].code}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Popular Topics Section */}
      <motion.section
        className="py-16 bg-gradient-to-b from-background to-secondary/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <Badge className="mb-4 backdrop-blur-sm">Popular Topics</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Master these key areas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Focus your practice on these essential topics that appear
              frequently in technical interviews.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            variants={containerVariants}
          >
            {popularTopics.map((topic, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="backdrop-blur-sm"
              >
                <Card className="bg-card/30 hover:bg-card/50 transition-all border-primary/5 hover:border-primary/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {topic.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{topic.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {topic.count} problems
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-secondary/5 backdrop-blur-sm relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {renderBlurEffects()}

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <Badge className="mb-4 backdrop-blur-sm">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything you need to crack the code
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines the best coding challenges with AI
              assistance to help you master algorithms and data structures.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <Card className="h-full backdrop-blur-md bg-card/30 hover:bg-card/50 transition-all duration-300 border-primary/5 hover:border-primary/20">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm flex-1">
                      {feature.description}
                    </p>

                    <motion.div
                      className="mt-4"
                      animate={
                        hoveredFeature === index
                          ? { opacity: 1 }
                          : { opacity: 0 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        className="p-0 h-auto text-primary group"
                      >
                        Learn more
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Difficulty Levels Section */}
      <motion.section
        className="py-20 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {renderBlurEffects()}

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <Badge className="mb-4 backdrop-blur-sm">Challenges</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Problems for every skill level
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From beginner to expert, we have challenges that will help you
              grow at your own pace.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {difficultyLevels.map((level, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                animate={pulseVariants.pulse}
              >
                <Card className="h-full backdrop-blur-md overflow-hidden border-primary/5 bg-card/30 hover:bg-card/50 transition-all">
                  <div className={`h-2 ${level.color}`}></div>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <Badge className={`${level.color} text-white`}>
                        {level.level}
                      </Badge>
                      <div className="text-2xl font-bold">{level.count}+</div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">
                      {level.description}
                    </p>

                    <div className="mb-6 backdrop-blur-sm bg-background/20 p-3 rounded-lg">
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">
                        Popular Problems:
                      </h4>
                      <ul className="space-y-1">
                        {level.examples.map((example, i) => (
                          <li
                            key={i}
                            className="text-sm flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-primary"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full mt-auto group">
                      View {level.level} Problems
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
