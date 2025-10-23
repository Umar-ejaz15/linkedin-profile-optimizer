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
  title: "LinkedIn AI Toolkit",
  description: "AI-powered tools for generating LinkedIn headlines, posts, and more.",
  metadataBase: new URL("https://linkedin-profile-optimizer.vercel.app/"),
  keywords: ["LinkedIn", "AI", "Headline Generator", "Post Writer", "Profile Tools"],
  authors: [{ name: "Your Name" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "LinkedIn AI Toolkit",
    description: "AI-powered tools for generating LinkedIn headlines, posts, and more.",
    type: "website",
    url: "https://linkedin-profile-optimizer.vercel.app/",
    images: [
      {
        url: "https://linkedin-profile-optimizer.vercel.app//og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkedIn AI Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn AI Toolkit",
    description: "AI-powered tools for generating LinkedIn headlines, posts, and more.",
    images: ["https://linkedin-profile-optimizer.vercel.app/og-image.png"],
    site: "@yourTwitterHandle",
    creator: "@yourTwitterHandle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
