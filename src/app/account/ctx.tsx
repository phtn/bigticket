import { ConvexCtx } from "@/app/ctx/convex";
import { VxCtx } from "@/app/ctx/convex/vx";
import { onSuccess } from "@/app/ctx/toast";
import type { SelectUser } from "convex/users/d";

import {
  use,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, ReactNode, RefObject } from "react";
import { type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

export interface Point {
  dx: number;
  dy: number;
}

interface AccountCtxValues {
  open: boolean;
  fileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleEditor: VoidFunction;
  preview: string | null;
  save: () => Promise<void>;
  saving: boolean;
  inputFileRef: RefObject<HTMLInputElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  browseFile: VoidFunction;
  vx: SelectUser | null;
  pending: boolean;
}

export const AccountCtx = createContext<AccountCtxValues | null>(null);

export const AccountContext = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { files, usr } = use(ConvexCtx)!;
  const { vx, pending } = use(VxCtx)!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const browseFile = useCallback(() => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
      inputFileRef.current.value = "";
    }
  }, [inputFileRef]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    const img = new Image();

    img.onload = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      } else {
        console.error("Failed to get canvas context");
      }
    };
    img.onerror = () => {
      console.error("Failed to load image");
    };
    img.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const fileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f);
      setOpen(true);
    }
  }, []);

  const toggleEditor = useCallback(() => setOpen((prev) => !prev), [setOpen]);

  const createUrl = useCallback(async () => {
    if (selectedFile) {
      const file = await convertToWebPFile(selectedFile, canvasRef);
      return await files.create(file as File);
    }
  }, [selectedFile, files]);

  const save = useCallback(async () => {
    setSaving(true);
    const pfp_url = await createUrl();

    if (vx?.id && pfp_url) {
      const id = await usr.add.metadata(vx.id, { pfp_url });
      if (id) {
        onSuccess("Photo uploaded.");
        setOpen(false);
        setSaving(false);
      }
      setSaving(false);
    }

    setSaving(false);
  }, [createUrl, usr.add, vx?.id]);

  // const getPfp = useCallback(async () => {
  //   const metadata = vxuser?.metadata?.[0] as { pfp: string };
  //   setPfp(await files.get(metadata.pfp));
  // }, [files, vxuser]);

  // useEffect(() => {
  //   getPfp().catch(Err);
  // }, [getPfp]);

  const value = useMemo(
    () => ({
      open,
      fileChange,
      toggleEditor,
      pending,
      save,
      saving,
      inputFileRef,
      browseFile,
      canvasRef,
      preview,
      transformRef,
      vx,
    }),
    [
      open,
      fileChange,
      toggleEditor,
      pending,
      save,
      saving,
      inputFileRef,
      browseFile,
      canvasRef,
      preview,
      transformRef,
      vx,
    ],
  );

  return <AccountCtx value={value}>{children}</AccountCtx>;
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