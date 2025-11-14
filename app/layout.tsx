import "./globals.css";
import React from "react";

export const metadata = {
  title: "Performance Dashboard",
  description: "High-performance realtime dashboard demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-[#020617] text-white">
        {children}
      </body>
    </html>
  );
}
