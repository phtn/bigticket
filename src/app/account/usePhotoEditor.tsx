import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { Log } from "@/utils/logger";

export const usePhotoEditor = () => {
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const drawPoint = useCallback((x: number, y: number) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.fillStyle = "red";
      ctx?.beginPath();
      ctx?.arc(x, y, 5, 0, 2 * Math.PI); // Draw a small circle
      ctx?.fill();
    }
  }, []);

  const handleDragStart = useCallback((e: MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCanvasClick = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (!transformRef.current) return;
      const { setTransform, instance } = transformRef.current;

      // Get the bounding rect of the canvas
      if (!canvasRef.current) return;
      setTransform(0, 0, 1);
      const rect = canvasRef.current.getBoundingClientRect();

      // Capture mouse position on the canvas
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      Log("left", rect.left);
      Log("top", rect.top);
      Log("state", instance.startCoords);

      // Adjust for zoom and pan offsets
      const adjustedX = (clientX - (instance.startCoords?.x ?? 0)) / 2;
      const adjustedY = (clientY - (instance.startCoords?.y ?? 0)) / 2;

      // // Draw the point on the canvas
      drawPoint(adjustedX, adjustedY);
    },
    [drawPoint],
  );

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;

    // Optionally clear the canvas
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return { isDragging, handleDragEnd, handleDragStart, handleCanvasClick };
};
