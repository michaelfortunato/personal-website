"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // TODO: Investigate the type error
  // @ts-ignore
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
