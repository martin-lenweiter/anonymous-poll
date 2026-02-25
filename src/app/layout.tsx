import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Should we buy Celine a dildo? - THE POLL",
  description: "The most important anonymous poll on the internet. Vote now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
