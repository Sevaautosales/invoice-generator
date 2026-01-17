import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seva Auto Sales | Invoice Generator",
  description: "Professional invoice management for Seva Auto Sales",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Seva Auto Sales",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/logo.png",
  },
};

export const viewport = {
  themeColor: "#0EA5E9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="flex h-screen overflow-hidden print:h-auto print:overflow-visible">
          <div className="print:hidden">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto print:overflow-visible print:p-0 print:m-0">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 print:p-0 print:m-0 print:max-w-none">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
