import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ThemeApplier from "@/components/ThemeApplier";

import { AppProvider } from "@/contexts/AppContext";
import { TradingProvider } from "@/contexts/TradingContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import UIEffectsProvider from "@/components/providers/UIEffectsProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deriv Demo",
  description: "Trading and betting demo dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <TradingProvider>
            <WatchlistProvider>
                <TransactionProvider>
                  <NotificationProvider>
                    <UIEffectsProvider>
                        <ThemeApplier />
                        {children}
                    </UIEffectsProvider>
                  </NotificationProvider>
                </TransactionProvider>
            </WatchlistProvider>
          </TradingProvider>
        </AppProvider>
      </body>
    </html>
  );
}