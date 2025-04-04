import { guid } from "@/utils/helpers";
import { convertToWebPFile } from "@/utils/webp";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";

interface ColorAnalysis {
  isLight: boolean;
  rgb: { r: number; g: number; b: number };
}

/**
 * Calculates average color from image data
 */
const getAverageColor = (
  data: Uint8ClampedArray,
  startIndex: number,
  endIndex: number,
): { r: number; g: number; b: number } => {
  let r = 0,
    g = 0,
    b = 0;
  let pixelCount = 0;

  for (let i = startIndex; i < endIndex; i += 4) {
    r += data[i] ?? 0;
    g += data[i + 1] ?? 0;
    b += data[i + 2] ?? 0;
    pixelCount++;
  }

  return {
    r: Math.floor(r / pixelCount),
    g: Math.floor(g / pixelCount),
    b: Math.floor(b / pixelCount),
  };
};

/**
 * Determines if a color is light based on luminance
 */
const isLightColor = (r: number, g: number, b: number): boolean => {
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186;
};

/**
 * Analyzes image color from a specific region
 */
const analyzeImageColor = async (
  src: string,
  width = 240,
  height = 40,
): Promise<ColorAnalysis> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Set dimensions and draw image section
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Get image data from the drawn region
      const imageData = ctx.getImageData(0, 0, width, height);
      const rgb = getAverageColor(imageData.data, 0, imageData.data.length);

      resolve({
        isLight: isLightColor(rgb.r, rgb.g, rgb.b),
        rgb,
      });
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
};

export const useImage = (
  canvas: HTMLCanvasElement | null,
  inputFile: HTMLInputElement | null,
) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isLight, setIsLight] = useState<boolean>(true);
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysis | null>(
    null,
  );

  const browseFile = useCallback(() => {
    if (inputFile) {
      inputFile.click();
      inputFile.value = "";
    }
  }, [inputFile]);

  const onInputFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    return file;
  }, []);

  // Handle file preview
  useEffect(() => {
    if (!selectedFile || !canvas) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Analyze color after drawing
        try {
          const analysis = await analyzeImageColor(img.src);
          setIsLight(analysis.isLight);
          setColorAnalysis(analysis);
        } catch (error) {
          console.error("Failed to analyze image color:", error);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }, [selectedFile, canvas]);

  const fromFile = useCallback(
    async (file: File | undefined) => {
      if (!file || !canvas) return;
      return await convertToWebPFile(file, canvas);
    },
    [canvas],
  );

  const fromSource = useCallback(
    async (src: string) => {
      if (!canvas) return;
      const fileData = await urlToFile(src);
      if (!fileData) return;
      return await convertToWebPFile(fileData.file, canvas);
    },
    [canvas],
  );

  return {
    onInputFileChange,
    browseFile,
    isLight,
    fromSource,
    fromFile,
    colorAnalysis,
  };
};

/**
 * Utility function to convert URL to File
 */
export async function urlToFile(
  url: string,
): Promise<{ file: File; url: string } | undefined> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = `BIG-${guid().split("-")[2]}`;
    const file = new File([blob], filename, { type: blob.type });
    return { file, url };
  } catch (error) {
    console.error("Failed to convert URL to File:", error);
    return undefined;
  }
}

export async function urlsToFiles(urls: (string | null)[]) {
  const filePromises = urls?.map(async (url) => {
    url ??= "_";
    const fileData = await urlToFile(url);
    return fileData;
  });
  return Promise.all(filePromises);
}
