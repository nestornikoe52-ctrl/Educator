import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { FileScores } from "@/components/FileScores";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Éducation Togo",
  description:
    "Révisions du collège togolais, de la 6e à la 3e, selon l'Approche Par Compétences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${outfit.variable} font-sans antialiased`}>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8">
          <FileScores />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
