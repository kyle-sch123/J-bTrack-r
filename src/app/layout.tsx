import type { Metadata } from "next";
import { Fraunces, Karla, Spline_Sans_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Trackr — keep your job hunt warm",
  description:
    "A quiet companion that reads your inbox and keeps every job application gently accounted for. Free forever, read-only Gmail, no spreadsheet required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${fraunces.variable} ${karla.variable} ${splineSansMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
