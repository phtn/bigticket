import { ConvexCtx } from "@/app/ctx/convex";
import {
  type RefObject,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const useImage = () => {
  const [selected, setSelected] = useState<File>();
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { files } = use(ConvexCtx)!;

  const browseFile = useCallback(() => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
      inputFileRef.current.value = "";
    }
  }, [inputFileRef]);

  useEffect(() => {
    if (selected) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(selected);
    }
  }, [selected]);

  const createFileUpload = useCallback(async () => {
    if (selected) {
      const file = await convertToWebPFile(selected, canvasRef);
      return await files.create(file as File);
    }
  }, [selected, files]);

  return { inputFileRef, canvasRef, browseFile, setSelected, createFileUpload };
};

async function convertToWebPFile(
  inputFile: File,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  filename = "pfp.webp",
) {
  // Create an image element
  const img = new Image();

  // Create a canvas element
  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  // Load the image
  const imageUrl = URL.createObjectURL(inputFile);

  // Convert to webp using canvas
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Set canvas size to match image
      const dw = img.width * 0.4;
      const dh = img.height * 0.4;
      canvas.width = dw;
      canvas.height = dh;

      // Draw image onto canvas
      ctx?.drawImage(img, 0, 0, dw, dh);

      // Convert to webp
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create File object from blob
            const webpFile = new File([blob], filename, { type: "image/webp" });
            resolve(webpFile);
          } else {
            reject(new Error("Canvas to Blob conversion failed"));
          }

          // Clean up
          URL.revokeObjectURL(imageUrl);
        },
        "image/webp",
        0.75,
      ); // 0.8 is the quality (0-1)
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}
