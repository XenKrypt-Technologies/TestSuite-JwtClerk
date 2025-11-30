import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vault Server Test Client",
  description: "Test client for vault server API",
};

// Debug the environment variable
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
console.log('Clerk Publishable Key loaded:', publishableKey ? `${publishableKey.substring(0, 20)}...` : 'NOT FOUND');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!publishableKey) {
    console.error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing from environment variables');
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
