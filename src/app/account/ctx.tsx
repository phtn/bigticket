"use client";

import { useConvexCtx } from "@/app/ctx/convex";
import { onSuccess } from "@/app/ctx/toast";
import type { ChangeEvent, ReactNode, RefObject } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { useAccountCtx } from "@/app/ctx/accounts";
import { convertToWebPFile } from "@/utils/webp";
import { Err } from "@/utils/helpers";

export interface Point {
  dx: number;
  dy: number;
}

interface AccountProfileCtxValues {
  open: boolean;
  fileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleEditor: VoidFunction;
  preview: string | null;
  saveFn: () => Promise<void>;
  saving: boolean;
  inputFileRef: RefObject<HTMLInputElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  browseFile: VoidFunction;
  pending: boolean;
  photo_url: string | null;
  updating: boolean;
  photoUrl: string | null;
}

export const AccountProfileCtx = createContext<AccountProfileCtxValues | null>(
  null,
);

export const AccountProfileContext = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { vxFiles, vxAccounts } = useConvexCtx();
  const { xAccount, isPending } = useAccountCtx();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (xAccount) {
      const item = localStorage.getItem(xAccount.uid);
      const pic = item
        ? (JSON.parse(item) as { photoUrl: string } | null)
        : null;
      setPhotoUrl(pic?.photoUrl ?? null);
    }
  }, [xAccount, vxAccounts]);

  useEffect(() => {
    const fetchAndCachePhotoUrl = async () => {
      if (!xAccount?.uid) return;

      // Try to get from localStorage first
      const cached = localStorage.getItem(xAccount.uid);
      const cachedData = cached
        ? (JSON.parse(cached) as { photoUrl: string } | null)
        : null;

      if (cachedData?.photoUrl) {
        setPhotoUrl(cachedData.photoUrl);
      } else if (xAccount.photo_url) {
        // If not in cache but user has photo_url, fetch and cache it
        try {
          const imageUrl = await vxFiles.getUrl(xAccount.photo_url);
          if (imageUrl) {
            localStorage.setItem(
              xAccount.uid,
              JSON.stringify({ photoUrl: imageUrl }),
            );
            setPhotoUrl(imageUrl);
          }
        } catch (error) {
          console.error("Failed to fetch photo URL:", error);
        }
      }
    };

    fetchAndCachePhotoUrl().catch(Err);
  }, [xAccount, vxFiles]);

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
      const file = await convertToWebPFile(selectedFile, canvasRef.current);
      return await vxFiles.create(file);
    }
  }, [selectedFile, vxFiles]);

  const updatePhotoUrl = useCallback(
    async (id: string, photo_url: string) =>
      await vxAccounts.mut.updatePhotoUrl({ id, photo_url }),
    [vxAccounts.mut],
  );

  const saveFn = useCallback(async () => {
    try {
      setSaving(true);

      // Create new photo URL
      const newPhotoUrl = await createUrl();
      if (!newPhotoUrl || !xAccount?.uid) return;

      // Update user's photo URL in database
      const id = await updatePhotoUrl(xAccount.uid, newPhotoUrl);
      if (!id) return;

      // Get the publicly accessible URL
      const imageUrl = await vxFiles.getUrl(newPhotoUrl);
      if (!imageUrl) return;

      // Update UI state and cache
      setOpen(false);
      setUpdating(true);

      // Cache the new URL
      localStorage.setItem(
        xAccount.uid,
        JSON.stringify({ photoUrl: imageUrl }),
      );

      // Update state
      setPhotoUrl(imageUrl);
      onSuccess("Image uploaded!");
    } catch (error) {
      console.error("Failed to save photo:", error);
    } finally {
      setSaving(false);
      setUpdating(false);
    }
  }, [createUrl, updatePhotoUrl, xAccount?.uid, vxFiles]);

  const value = useMemo(
    () => ({
      open,
      fileChange,
      toggleEditor,
      pending: isPending,
      saveFn,
      saving,
      inputFileRef,
      browseFile,
      canvasRef,
      preview,
      transformRef,
      photo_url: xAccount?.photo_url ?? null,
      updating,
      photoUrl,
    }),
    [
      open,
      fileChange,
      toggleEditor,
      isPending,
      saveFn,
      saving,
      inputFileRef,
      browseFile,
      canvasRef,
      preview,
      transformRef,
      xAccount?.photo_url,
      updating,
      photoUrl,
    ],
  );

  return <AccountProfileCtx value={value}>{children}</AccountProfileCtx>;
};

export const useAccountProfileCtx = () => {
  const context = useContext(AccountProfileCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
