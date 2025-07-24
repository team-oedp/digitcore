import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Button } from "~/components/ui/button";
import { ModeToggle } from "~/components/mode-toggle";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digitcore",
  description: "Digital Toolkit for Collaborative Environmental Research",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className={`${geist.variable}`}>
      <div className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global navigation */}
          <header className="border-b bg-background/60 backdrop-blur supports-backdrop-blur:bg-background/80 sticky top-0 z-50">
            <nav className="container mx-auto flex items-center justify-between px-4 py-3 gap-4">
              <Button
                variant="link"
                asChild
                className="text-lg font-semibold p-0"
              >
                <Link href="/">DIGITCORE Toolkit</Link>
              </Button>

              {/* Primary navigation links + theme toggle */}
              <div className="flex items-center gap-2">
                <ul className="flex flex-wrap gap-2 text-sm">
                  <li>
                    <Button variant="link" asChild>
                      <Link href="/carrier-bag">Carrier Bag</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild>
                      <Link href="/tags">Tags</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild>
                      <Link href="/glossary">Glossary</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild>
                      <Link href="/onboarding">Onboarding</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild>
                      <Link href="/values">Values</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" asChild>
                      <Link href="/search">Search</Link>
                    </Button>
                  </li>
                </ul>
                <ModeToggle />
              </div>
            </nav>
          </header>
          <TRPCReactProvider>
            {/* Main content wrapper */}
            <main className="container mx-auto px-4 py-8">{children}</main>
          </TRPCReactProvider>
        </ThemeProvider>
      </div>
    </section>
  );
}
