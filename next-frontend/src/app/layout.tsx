import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AppLayout from "./components/AppLayout";

export const metadata: Metadata = {
  title: "Суар",
  description: "Платформа общения нового поколения",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
