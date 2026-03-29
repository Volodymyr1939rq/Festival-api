import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "АртФест | Організація",
  description: "Система управління фестивалем та учасниками",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <header className="bg-slate-50 sticky top-0 z-50 shadow-sm border-b border-slate-100"> 
          <div className="max-w-7xl mx-auto px-6 md:px-10 h-24 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-3xl text-slate-900 tracking-tight hover:opacity-80 transition-opacity shrink-0">
              АртФест
            </Link>
           
           <Navbar/>
            
          </div>
        </header>
        
        {children}
        
      </body>
    </html>
  );
}