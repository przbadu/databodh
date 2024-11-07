import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DataBodh",
  description: "Master Your Data: Seamlessly Convert, Explore, and Transform File Formats with Ease!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full m-0 p-0">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full m-0 p-0 antialiased`}>
        {children}
      </body>
    </html>
  );
}
