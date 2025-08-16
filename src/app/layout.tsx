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
import Providers from "./ctx";
import { Navbar, Spacer } from "./_components_/navbar";

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
  icons: [{ rel: "icon", url: "/icon/tab.svg" }],
};

/**
 * Renders the root layout of the Next.js application.
 *
 * This component establishes the base HTML structure by setting the language attribute, applying global font
 * styles, and enabling antialiased rendering. It wraps the application content with global providers, includes
 * a navigation bar, and inserts a spacer before rendering the child components.
 *
 * @param children - The content to be displayed within the layout.
 * @returns The complete HTML structure for the application.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${mono.variable} ${inter.variable} ${cherry.variable} ${lucky.variable} ${poet.variable} antialiased`}
    >
      <body className="bg-foreground">
        <Providers>
          <Navbar />
          <Spacer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
