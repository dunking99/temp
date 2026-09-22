import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian — Component Specimen Book · Vol. 01",
  description:
    "120 designs for 40 Meridian dashboard components: huge, big, medium, small and tiny plates, drawn as a statistical specimen book.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F3EFE6] text-[#141210] antialiased">{children}</body>
    </html>
  );
}
