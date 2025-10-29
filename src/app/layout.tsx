"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex bg-gray-50">
          {/* Desktop sidebar (fixed left column) */}
          <Sidebar />

          {/* Right column: top bar (mobile) + page content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile top bar */}
            <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
              <div className="px-4 h-14 flex items-center justify-between">
                <button
                  aria-label="Abrir menu"
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <Link href="/" className="text-base font-semibold">Academia</Link>
                <div className="w-9" />
              </div>
            </div>

            {/* Main content area */}
            <main className="flex-1 w-full">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="lg:hidden fixed inset-0 z-40">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl p-4">
                <div className="pb-4 border-b border-gray-200 mb-4">
                  <span className="text-lg font-bold">Academia</span>
                </div>
                <nav className="space-y-2">
                  <Link href="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Início</Link>
                  <Link href="/alunos" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Alunos</Link>
                  <Link href="/aulas" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Aulas</Link>
                  <Link href="/aulas/agendar" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Agendar</Link>
                  <Link href="/relatorios" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Relatórios</Link>
                </nav>
                <div className="pt-6">
                  <Button asChild className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link href="/aulas/agendar">Agendar Aula</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
