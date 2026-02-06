// 1. Use this file to define custom fonts
// 2. Update config.tailwind.js afterwards
import { Graduate, DM_Serif_Display, STIX_Two_Text } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
export const buildManfestHeadingFont = Graduate({
  weight: "400",
  subsets: ["latin"],
  variable: "--build-manifest-heading",
});

export const blogInitialsFont = DM_Serif_Display({
  style: ["normal", "italic"],
  subsets: ["latin"],
  weight: "400",
  variable: "--moniker",
});

export const blogBodyFont = STIX_Two_Text({
  weight: ["400", "500", "600", "700"], // "variable",
  style: ["normal", "italic"],
  subsets: [
    "latin",
    // "latin-ext",
    // "greek",
    // "cyrillic",
    // "cyrillic-ext",
    // "vietnamese",
  ],
  display: "swap",
  variable: "--font-blog-body",
});
