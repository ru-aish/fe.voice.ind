import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevix - AI Receptionist",
  description: "24/7 AI receptionist that answers calls, books appointments, and captures leads. Sounds 100% human.",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {children}
      </body>
    </html>
  );
}
