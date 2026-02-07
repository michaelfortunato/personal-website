/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        index: {
          background: "#e6af4b",
          foreground: "#264653",
          foreground2: "rgba(230, 175, 75, 1)",
        },
        about: {
          background: "#14213D",
          foreground: "#e6af4b",
          foreground2: "rgba(20, 33, 61, 1)",
        },
        projects: {
          background: "#D5E5E5",
          foreground: "#D5E5E5",
          foreground2: "#e6af4b",
        },
        blog: {
          background: "#14213D",
          foreground: "#14213D",
          foreground2: "#e6af4b",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        buildManifestHeading: [
          "var(--build-manifest-heading)",
          ...require("tailwindcss/defaultTheme").fontFamily.sans,
        ],
        moniker: [
          "var(--moniker)",
          ...require("tailwindcss/defaultTheme").fontFamily.sans,
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: () => ({
        // A more "print-like" rhythm for longform reading (Typst → HTML).
        mnf: {
          css: {
            // Base
            fontSize: "clamp(1rem, 0.96rem + 0.25vw, 1.125rem)",
            lineHeight: "1.65",
            textRendering: "optimizeLegibility",
            fontKerning: "normal",

            // Better line breaking
            // Paragraph rhythm (less airy than Tailwind defaults)
            p: {
              hyphens: "auto",
              overflowWrap: "break-word",
              marginTop: "0.85em",
              marginBottom: "0.85em",
            },

            // Headings: closer to Typst/LaTeX proportions than default prose
            h2: {
              fontSize: "1.35em",
              lineHeight: "1.25",
              marginTop: "1.8em",
              marginBottom: "0.75em",
              fontWeight: "600",
              textWrap: "balance",
            },
            h3: {
              fontSize: "1.15em",
              lineHeight: "1.3",
              marginTop: "1.6em",
              marginBottom: "0.6em",
              fontWeight: "600",
              textWrap: "balance",
            },
            h4: {
              fontSize: "1.05em",
              lineHeight: "1.35",
              marginTop: "1.4em",
              marginBottom: "0.55em",
              fontWeight: "600",
              textWrap: "balance",
            },

            // Lists
            ul: {
              marginTop: "0.85em",
              marginBottom: "0.85em",
              paddingLeft: "1.25em",
            },
            ol: {
              marginTop: "0.85em",
              marginBottom: "0.85em",
              paddingLeft: "1.25em",
            },
            li: {
              hyphens: "auto",
              overflowWrap: "break-word",
              marginTop: "0.25em",
              marginBottom: "0.25em",
            },

            // Typst emits display math as <figure class="math-display ...">
            "figure.math-display": {
              marginTop: "1em",
              marginBottom: "1em",
              overflowX: "auto",
            },
            "figure.math-display > svg.typst-frame": {
              maxWidth: "100%",
            },

            // Typst HTML: definitions/theorems often come out as plain <div>
            ".typst-content > div": {
              hyphens: "auto",
              overflowWrap: "break-word",
              marginTop: "0.85em",
              marginBottom: "0.85em",
            },

            ".typst-content a[id]:not([href])": {
              display: "block",
              height: "0",
            },

            // Keep large inline SVG math from overflowing on narrow screens.
            ".typst-content span.inline-block": { maxWidth: "100%" },
            ".typst-content svg.typst-frame": { maxWidth: "100%" },

            // Typst uses list containers with `list-style-type: none` for
            // bibliography + endnotes; override Tailwind prose indentation.
            '.typst-content ul[style*="list-style-type: none"], .typst-content ol[style*="list-style-type: none"]':
              { paddingLeft: "0" },

            // Bibliography: Typst uses a `hanging-indent` class
            ".typst-content .hanging-indent li": {
              paddingLeft: "1.5em",
              textIndent: "-1.5em",
            },
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
