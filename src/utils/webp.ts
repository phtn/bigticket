interface ImageConversion {
  width: number;
  height: number;
  quality: number;
  type: 'image/webp';
}

const DEFAULT_CONFIG: ImageConversion = {
  width: 800,
  height: 800,
  quality: 0.7,
  type: 'image/webp'
} as const;

/**
 * Converts an input file to WebP format
 * @param inputFile - The input file to convert
 * @param canvas - The canvas element to use for conversion
 * @param filename - The output filename
 * @returns Promise<File> - A WebP file
 */
export async function convertToWebPFile(
  inputFile: File,
  canvas: HTMLCanvasElement | null,
  filename = "bigT.webp",
): Promise<File> {
  if (!canvas) {
    throw new Error("Canvas element is required");
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Create and load image
  const img = new Image();
  const imageUrl = URL.createObjectURL(inputFile);

  try {
    // Wait for image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });

    // Calculate dimensions maintaining aspect ratio
    const aspectRatio = img.width / img.height;
    const dimensions = {
      width: DEFAULT_CONFIG.width,
      height: Math.round(DEFAULT_CONFIG.width / aspectRatio)
    };

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Draw and convert
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob conversion failed"));
          }
        },
        DEFAULT_CONFIG.type,
        DEFAULT_CONFIG.quality
      );
    });

    // Create and return File
    return new File([blob], filename, {
      type: DEFAULT_CONFIG.type,
      lastModified: Date.now()
    });

  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Image conversion failed");
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

/**
 * Validates if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Gets file dimensions
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
