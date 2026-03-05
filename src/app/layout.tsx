import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";

export const metadata = {
  title: "DevBoard",
  description: "Developer dashboard — tasks, notes, stats",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise-bg min-h-screen" style={{ background: "var(--bg-base)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
