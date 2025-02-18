import { guid } from "@/utils/helpers";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

export const useImage = (canvas: HTMLCanvasElement | null, inputFile: HTMLInputElement | null) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(inputFile?.files?.[0]);
  const [isLight, setIsLight] = useState<boolean>(true);

  const browseFile = useCallback(() => {
    if (inputFile) {
      inputFile.click();
      inputFile.value = "";
    }
  }, [inputFile]);

  const onInputFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedFile(e.target.files[0]);
    return e.target.files[0];
  }, [])

  useEffect(() => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);

  }, [selectedFile, canvas]);

  useEffect(() => {
    if (selectedFile) {
      setIsLight(getTextColor(URL.createObjectURL(selectedFile)));
    }
  }, [selectedFile]);

  const fromFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    return await convertToWebPFile(file, canvas);
  }, [canvas]);

  const fromSource = useCallback(async (src: string) => {
    const fileData = await urlToFile(src);
    if (!fileData) return;
    return await convertToWebPFile(fileData.file, canvas);
  }, [canvas]);

  return { onInputFileChange, browseFile, isLight, fromSource, fromFile };
};

export const getTextColor = (src: string, w?: number, h?: number) => {
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const sampleWidth = w ?? 100;
        const sampleHeight = h ?? 400;
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight, 0, 0, sampleWidth, sampleHeight);
        const { r, g, b } = getAverageColor(ctx, sampleWidth, sampleHeight);
        return isLightColor(r, g, b)
      }
    }
  }

  return true
}

async function convertToWebPFile(
  inputFile: File,
  canvas: HTMLCanvasElement | null,
  filename = "bigT.webp",
) {
  // Create an image element
  const img = new Image();

  // Create a canvas element
  if (!canvas) return;
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
        0.80,
      ); // 0.8 is the quality (0-1)
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}

export const isLightColor = (r: number | undefined, g: number | undefined, b: number | undefined) => {
  // Calculate the luminance of the color
  const luminance = 0.299 * (r ?? 0) + 0.587 * (g ?? 0) + 0.114 * (b ?? 0);
  return luminance > 186; // A threshold value to determine if the color is light
};

export const getAverageColor = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let r = 0, g = 0, b = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i] ?? 0;
    g += data[i + 1] ?? 0;
    b += data[i + 2] ?? 0;
  }

  const pixelCount = data.length / 4;
  r = Math.floor(r / pixelCount);
  g = Math.floor(g / pixelCount);
  b = Math.floor(b / pixelCount);

  return { r, g, b };
};

export async function urlToFile(url: string | null) {
  if (!url) return;
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = "BIG" + guid().split("-")[2];
  const file = new File([blob], filename, { type: blob.type });
  return { url, filename, file, id: 1 };
}

export async function urlsToFiles(urls: (string | null)[]) {
  const filePromises = urls?.map(async (url) => {
    if (!url) url = "_";
    const fileData = await urlToFile(url);
    return fileData
  });
  return Promise.all(filePromises);
}