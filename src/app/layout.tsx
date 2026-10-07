// Force Rebuild
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | LORVEN GOLF",
    default: "LORVEN GOLF - Premium Golf Equipment, Clubs, and Apparel",
  },
  description: "Shop the best selection of premium golf equipment, clubs, bags, shoes, and apparel from top brands at Lorven Golf.",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "LORVEN GOLF",
    description: "Shop the best selection of premium golf equipment.",
    type: "website",
    siteName: "LORVEN GOLF",
  },
};

import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-clip max-w-[100vw]`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col overflow-x-clip max-w-[100vw]">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
