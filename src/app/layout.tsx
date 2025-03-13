import "@/styles/globals.css";
import { type Metadata } from "next";
import {
  Cherry_Bomb_One,
  Inter,
  Luckiest_Guy,
  Poetsen_One,
  Geist,
  Geist_Mono,
} from "next/font/google";
import { type ReactNode } from "react";
import { Navbar } from "./_components_/navbar";
import Providers from "./ctx";

const geist = Geist({
  variable: "--font-geist",
  weight: ["400"],
  subsets: ["latin"],
});
const mono = Geist_Mono({
  variable: "--font-mono",
  weight: ["400"],
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const cherry = Cherry_Bomb_One({
  variable: "--font-cherry",
  weight: ["400"],
  subsets: ["latin"],
});
const lucky = Luckiest_Guy({
  variable: "--font-lucky",
  weight: ["400"],
  subsets: ["latin"],
});
const poet = Poetsen_One({
  variable: "--font-poet",
  weight: ["400"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Big Ticket",
  description: "Excitement guaranteed!",
  icons: [{ rel: "icon", url: "/icon/logomark_v2.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable} ${inter.variable} ${cherry.variable} ${lucky.variable} ${poet.variable} antialiased`}
    >
      <body>
        <Providers>
          <Navbar />
          <div className="relative h-16" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
