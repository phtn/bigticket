"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Image } from "@nextui-org/react";

interface Clog {
  id: number;
  name: string;
  src: string;
}

interface ColProps {
  clogs: Clog[];
  columnIndex: number;
  currentTime: number;
}

interface ClogProps {
  columns?: number;
}
export const Clogo = ({ columns = 2 }: ClogProps) => {
  const [cols, setCols] = useState<Clog[][]>([]);
  const [time, setTime] = useState(0);
  // const CYCLE_DURATION = 2000; // 2 seconds per logo

  // Define logos using public SVGs
  const clogs = useMemo<Clog[]>(
    () => [
      { id: 1, name: "re-up", src: "/svg/re-up.svg" },
      { id: 2, name: "ap", src: "/svg/ap.svg" },
      { id: 3, name: "fast", src: "/svg/fast.svg" },
      { id: 4, name: "lav", src: "/svg/lav.svg" },
      { id: 5, name: "oms", src: "/svg/oms.svg" },
      { id: 6, name: "goph", src: "/svg/goph.svg" },
      { id: 7, name: "blue", src: "/svg/blue.svg" },
      { id: 8, name: "gitfast", src: "/svg/gitfast.svg" },
      { id: 9, name: "abridge", src: "/svg/abridge.svg" },
    ],
    [],
  );

  // Distribute logos across columns
  const distributeLogos = useCallback(
    (logos: Clog[]) => {
      const shuffled = [...logos].sort(() => Math.random() - 0.5);
      const result: Clog[][] = Array.from({ length: columns }, () => []);

      shuffled.forEach((logo, index) => {
        result?.[index % columns]?.push(logo);
      });

      // Ensure equal length columns
      const maxLength = Math.max(...result.map((col) => col.length));
      result.forEach((col) => {
        while (col.length < maxLength) {
          col.push(shuffled[Math.floor(Math.random() * shuffled.length)]!);
        }
      });

      return result;
    },
    [columns],
  );

  // Initialize logo columns
  useEffect(() => {
    setCols(distributeLogos(clogs));
  }, [clogs, distributeLogos]);

  // Update time for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-4 py-8">
      {cols.map((col, index) => (
        <Col
          key={`${clogs[index]?.name}-${Number(clogs[index]?.id) + 5}`}
          clogs={col}
          columnIndex={index}
          currentTime={time}
        />
      ))}
    </div>
  );
};

// Column component
function Col({ clogs, columnIndex, currentTime }: ColProps) {
  const CYCLE_DURATION = 2800;
  const columnDelay = columnIndex * 750;
  const adjustedTime =
    (currentTime + columnDelay) % (CYCLE_DURATION * clogs.length);
  const currentIndex = Math.floor(adjustedTime / CYCLE_DURATION);
  const currentLogo = clogs[currentIndex];

  return (
    <motion.div
      key={`${currentLogo?.id}-${currentIndex}`}
      className="relative h-14 w-24 overflow-hidden md:h-24 md:w-48"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: columnIndex * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentLogo?.id}-${currentIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "10%", opacity: 0 }}
          animate={{
            y: "0%",
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          }}
          exit={{
            y: "-20%",
            opacity: 0,
            transition: { duration: 0.3 },
          }}
        >
          <Image
            src={currentLogo?.src}
            alt={currentLogo?.name ?? "logo"}
            className="h-20 max-h-[80%] w-auto object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
