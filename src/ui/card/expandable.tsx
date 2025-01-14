"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring } from "motion/react";

import { Card, CardFooter, CardHeader } from "@nextui-org/react";
import { Badge, Button, Avatar } from "@nextui-org/react";
import { Progress as ProgressBar } from "@nextui-org/react";
import { useState, useCallback } from "react";
import { Tooltip } from "@nextui-org/react";
import { Icon } from "@/icons";

interface ProjectStatusCardProps {
  title: string;
  progress: number;
  dueDate: string;
  contributors: Array<{ name: string; image?: string }>;
  tasks: Array<{ title: string; completed: boolean }>;
  githubStars: number;
  openIssues: number;
}

export function useExpandable(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const springConfig = { stiffness: 300, damping: 30 };
  const animatedHeight = useSpring(0, springConfig);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return { isExpanded, toggleExpand, animatedHeight };
}

export const Expandable = ({
  title,
  progress,
  dueDate,
  contributors,
  tasks,
  githubStars,
  openIssues,
}: ProjectStatusCardProps) => {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  return (
    <Card
      className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg"
      onPress={toggleExpand}
    >
      <CardHeader className="space-y-1">
        <div className="flex w-full items-start justify-between">
          <div className="space-y-2">
            <Badge
              // variant="secondary"
              className={
                progress === 100
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }
            >
              {progress === 100 ? "Completed" : "In Progress"}
            </Badge>
            <h3 className="text-2xl font-semibold">{title}</h3>
          </div>
          <Tooltip>
            <Button size="sm" isIconOnly variant="light" className="size-8">
              <Icon name="Copy" className="size-4" />
            </Button>
            <p>View on GitHub</p>
          </Tooltip>
        </div>
      </CardHeader>

      <section>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} className="h-2" />
          </div>

          <motion.div
            style={{ height: animatedHeight }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div ref={contentRef}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Icon name="Calendar" className="mr-2 size-4" />
                        <span>Due {dueDate}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Icon
                            name="Fire"
                            className="mr-1 size-4 text-yellow-400"
                          />
                          <span>{githubStars}</span>
                        </div>
                        <div className="flex items-center">
                          <Icon name="Fire" className="mr-1 size-4" />
                          <span>{openIssues} issues</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center text-sm font-medium">
                        <Icon name="Fire" className="mr-2 size-4" />
                        Contributors
                      </h4>
                      <div className="flex -space-x-2">
                        {contributors.map((contributor, index) => (
                          <Tooltip key={index}>
                            <Avatar
                              src={
                                contributor.image ??
                                `/placeholder.svg?height=32&width=32&text=${contributor.name[0]}`
                              }
                              className="border-2 border-white"
                            >
                              alt={contributor.name}
                            </Avatar>
                            <p>{contributor.name}</p>
                          </Tooltip>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Tasks</h4>
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">{task.title}</span>
                          {task.completed && (
                            <Icon
                              name="Fire"
                              className="size-4 text-green-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full">
                        <Icon name="Fire" className="mr-2 size-4" />
                        View Discussion
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <CardFooter>
        <div className="flex w-full items-center justify-between text-sm text-gray-600">
          <span>Last updated: 2 hours ago</span>
          <span>{openIssues} open issues</span>
        </div>
      </CardFooter>
    </Card>
  );
};
