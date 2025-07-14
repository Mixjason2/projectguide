import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "DTH TRAVEL Guide",
  description: "DTH TRAVEL Guide -  A guide for DTH TRAVEL operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
