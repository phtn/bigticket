"use client";

import { type ReactNode } from "react";

export default function SearchLayout({
  children,
  ev,
}: {
  children: ReactNode;
  ev: ReactNode;
}) {
  return (
    <main className="h-screen w-full">
      <div className="flex-grow">{children}</div>
      {ev}
    </main>
  );
}
