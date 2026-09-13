import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fynd QR — links that last",
  description: "Create Fynd-branded link and virtual-card QR codes with lifetime validity.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
