import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {
  Inter,
  Cherry_Bomb_One,
  Luckiest_Guy,
  Poetsen_One,
} from "next/font/google";
import Providers from "./ctx";
import { Navbar } from "./_components/navbar.tsx";

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
  title: "BigTicket",
  description: "Concerts & Arts",
  icons: [{ rel: "icon", url: "/icon/icon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${inter.variable} ${cherry.variable} ${lucky.variable} ${poet.variable} antialiased`}
    >
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
