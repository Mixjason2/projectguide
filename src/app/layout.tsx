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
      {/* <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D3E92" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head> */}
      <body>{children}</body>
    </html>
  );
}


