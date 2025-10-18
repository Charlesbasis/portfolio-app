import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yourportfolio.com'),
  title: {
    default: 'CVHowlader - Full Stack Web Developer Portfolio',
    template: '%s | CVHowlader'
  },
  description: 'Experienced Full Stack Developer with 5+ years building modern web applications using React, Next.js, Laravel, and Node.js',
  keywords: ['full stack developer', 'web developer', 'react', 'nextjs', 'laravel', 'nodejs', 'portfolio'],
  authors: [{ name: 'CVHowlader' }],
  creator: 'CVHowlader',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourportfolio.com',
    title: 'CVHowlader - Full Stack Web Developer',
    description: 'Professional portfolio showcasing 50+ web development projects',
    siteName: 'CVHowlader Portfolio',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'CVHowlader Portfolio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVHowlader - Full Stack Web Developer',
    description: 'Professional portfolio showcasing web development expertise',
    creator: '@yourusername',
    images: ['/og-image.jpg'],
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
