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
      <body>
        <main style={{ height: "100vh", width: "100vw" }}>{children}</main>
      </body>
    </html>
  );
}
