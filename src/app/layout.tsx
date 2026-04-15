import type { Metadata } from "next";
import { Bad_Script, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const handwritten = Bad_Script({
  variable: "--font-script",
  subsets: ["latin", "cyrillic-ext"],
  weight: "400",
  display: "swap",
});

const editorialSerif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Батырханның 6 жас тойына шақыру",
  description: "Батырханның 6 жасқа толуына арналған тойға шақыру.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="kk"
      className={`${handwritten.variable} ${editorialSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
