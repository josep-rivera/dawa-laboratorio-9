import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "DAWA — Laboratorio 9",
  description: "Next.js + TypeScript + Tailwind lab — CSR vs SSR rendering strategies",
};

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/pokemon-csr", label: "Pokémon CSR" },
  { href: "/pokemon-ssr", label: "Pokémon SSR" },
  { href: "/weather", label: "Clima" },
  { href: "/peliculas", label: "Películas" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="bg-gray-900 text-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
            <Link href="/" className="font-bold text-lg hover:text-gray-300">
              DAWA Lab 9
            </Link>
            <div className="flex flex-wrap gap-3 ml-auto">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
