import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import "./index.css";

interface HyperspaceProps {
  isInputHovered: boolean;
}
const HyperSpace = ({ isInputHovered }: HyperspaceProps) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const variants = useMemo(
    () => ({
      normal: {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        opacity: 1,
      },
      input: { width: "4px", height: "40px", borderRadius: "50%", opacity: 1 },
    }),
    [],
  );

  return (
    <motion.div
      className="hyperspace"
      style={{
        left: cursorPosition.x,
        top: cursorPosition.y,
      }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.1, type: "tween" }}
      variants={variants}
      animate={isInputHovered ? "input" : "normal"}
    />
  );
};

export default HyperSpace;