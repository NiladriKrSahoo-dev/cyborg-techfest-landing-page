import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Techfest CA Portal",
  description: "IIT Bombay Techfest Campus Ambassador Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#030303]">
        {children}
      </body>
    </html>
  );
}