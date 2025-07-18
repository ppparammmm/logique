import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StarScope - Professional Stargazing & Telescope Services",
  description: "Discover the wonders of the night sky with StarScope's professional stargazing experiences, premium telescope rentals, guided tours, and astrophotography workshops.",
  keywords: ["stargazing", "telescope rental", "astronomy tours", "astrophotography", "night sky", "celestial observation", "astronomy education"],
  authors: [{ name: "StarScope Team" }],
  creator: "StarScope",
  publisher: "StarScope",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://starscope.com'),
  openGraph: {
    title: "StarScope - Professional Stargazing Services",
    description: "Professional stargazing experiences, telescope rentals, and guided astronomical tours under pristine dark skies.",
    url: "https://starscope.com",
    siteName: "StarScope",
    images: [
      {
        url: "/starscope-og.jpg",
        width: 1200,
        height: 630,
        alt: "StarScope - Professional Stargazing Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StarScope - Professional Stargazing Services",
    description: "Discover the wonders of the night sky with professional stargazing experiences and telescope rentals.",
    images: ["/starscope-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
