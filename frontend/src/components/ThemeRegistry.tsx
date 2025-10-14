"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Wait for client-side hydration before rendering children
  if (!mounted) return null;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey="theme"
    >
      {children}
    </ThemeProvider>
  );
}
