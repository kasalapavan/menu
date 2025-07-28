// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cream Curls - Digital Menu",
  description: "Delicious treats and savory bites from Cream Curls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      {/* Ensure body uses the new primary background and textLight color */}
      <body className={`${inter.className} bg-primary text-textLight`}>
        {children}
      </body>
    </html>
  );
}