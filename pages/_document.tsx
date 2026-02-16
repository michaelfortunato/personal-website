import { Html, Head, Main, NextScript } from "next/document";

export default function MyDocument() {
  return (
    <Html suppressHydrationWarning lang="en">
      <Head>
        {/* PWA primary color */}
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
