'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Layout Imports
import Head from "./templateComponents/head/head";
import Footer from "./templateComponents/footer";
import Header from "./templateComponents/header";

import {createContext, useState} from 'react';

export type User = {
    isAuthenticated: boolean
    username: string
}

export type UserContextType = {
  user: User
  setUser:(x: User) => void
}

const UserContext = createContext<UserContextType>(
    {
        user: {username : "placeholder", isAuthenticated: false},
        setUser: () => {},
    }
)

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

    const [user, setUser] = useState({username : "placeholder", isAuthenticated: false});
    
  return (
    <html lang="en">
      <Head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserContext.Provider value={{user : user, setUser : setUser}}>
          <Header />
          {children}
          <Footer />
        </UserContext.Provider>
      </body>
    </html>
  );
}

//dont ask why it just works
export { UserContext }
