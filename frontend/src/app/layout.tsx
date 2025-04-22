'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Layout Imports
import Head from "./templateComponents/head/head";
import Footer from "./templateComponents/footer";
import Header from "./templateComponents/header";
import {ContextProvider} from "@/app/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
      <ContextProvider>
        <html lang="en">
            <Head />
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Header />
            {children}
            <Footer />
            </body>
        </html>
      </ContextProvider>
  );
}
