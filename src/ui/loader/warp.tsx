import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  perspective?: number;
  beamsPerSide?: number;
  beamSize?: number;
  beamDelayMax?: number;
  beamDelayMin?: number;
  beamDuration?: number;
  gridColor?: string;
}

interface IBeam {
  width: string | number;
  x: string | number;
  delay: number;
  duration: number;
  hue: number;
  aspectRatio: number;
}

const Beam = ({ width, x, delay, duration, hue, aspectRatio }: IBeam) => {
  return (
    <motion.div
      style={
        {
          "--x": `${x}`,
          "--width": `${width}`,
          "--aspect-ratio": `${aspectRatio}`,
          "--background": `linear-gradient(hsl(${hue / 2} 60% 80%), transparent)`,
        } as React.CSSProperties
      }
      className={`absolute left-[var(--x)] top-0 animate-pulse [aspect-ratio:1/var(--aspect-ratio)] [background:var(--background)] [width:var(--width)]`}
      initial={{ y: "100cqmax", x: "-50%" }}
      animate={{ y: "-100%", x: "-50%" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export const WarpDrive: React.FC<WarpBackgroundProps> = ({
  children,
  perspective = 60,
  className,
  beamsPerSide = 2,
  beamSize = 0.5,
  beamDelayMax = 6,
  beamDelayMin = 0.1,
  beamDuration = 2.5,
  gridColor = "hsl(var(--border))",
  ...props
}) => {
  const [topBeams, setTopBeams] = useState<IBeam[]>([]);
  const [rightBeams, setRightBeams] = useState<IBeam[]>([]);
  const [bottomBeams, setBottomBeams] = useState<IBeam[]>([]);
  const [leftBeams, setLeftBeams] = useState<IBeam[]>([]);

  const generateBeams = useCallback(() => {
    const beams = [];
    const cellsPerSide = Math.floor(200 / beamSize);
    const step = cellsPerSide / beamsPerSide;

    for (let i = 0; i < beamsPerSide; i++) {
      const x = Math.floor(i * step);
      const delay =
        Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin;
      beams.push({
        x,
        delay,
        width: `${beamSize}%`,
        duration: beamDuration,
        hue: Math.floor(Math.random() * 360),
        aspectRatio: Math.floor(Math.random() * 20) + 1,
      });
    }
    return beams;
  }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin, beamDuration]);

  useEffect(() => {
    setTopBeams(generateBeams());
    setRightBeams(generateBeams());
    setBottomBeams(generateBeams());
    setLeftBeams(generateBeams());
  }, [generateBeams]);

  return (
    <div className={cn("relative bg-coal p-6", className)} {...props}>
      <div
        style={
          {
            "--perspective": `${perspective}px`,
            "--grid-color": gridColor,
            "--beam-size": `${beamSize * 8}%`,
          } as React.CSSProperties
        }
        className={
          "pointer-events-none absolute left-0 top-0 size-full overflow-hidden [clip-path:inset(0)] [container-type:size] [perspective:var(--perspective)] [transform-style:preserve-3d]"
        }
      >
        {/* top side */}
        <div className="absolute [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:50%_0%] [transform-style:preserve-3d] [transform:rotateX(-90deg)] [width:100cqi]">
          {topBeams.map((beam, index) => (
            <Beam key={`top-${index}`} {...beam} />
          ))}
        </div>
        {/* bottom side */}
        <div className="absolute top-full [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:50%_0%] [transform-style:preserve-3d] [transform:rotateX(-90deg)] [width:100cqi]">
          {bottomBeams.map((beam, index) => (
            <Beam key={`bottom-${index}`} {...beam} />
          ))}
        </div>
        {/* left side */}
        <div className="absolute left-0 top-0 [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:0%_0%] [transform-style:preserve-3d] [transform:rotate(90deg)_rotateX(-90deg)] [width:100cqh]">
          {leftBeams.map((beam, index) => (
            <Beam key={`left-${index}`} {...beam} />
          ))}
        </div>
        {/* right side */}
        <div className="absolute right-0 top-0 [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:100%_0%] [transform-style:preserve-3d] [transform:rotate(-90deg)_rotateX(-90deg)] [width:100cqh]">
          {rightBeams.map((beam, index) => (
            <Beam key={`right-${index}`} {...beam} />
          ))}
        </div>
      </div>
      <div className="relative shadow-none">{children}</div>
    </div>
  );
};
