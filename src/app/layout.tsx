import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScholarTrend",
  description: "Research Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
