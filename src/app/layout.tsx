import type { Metadata } from "next";
/* STYLE MOD (step 1 — theme) — reference fonts: Poppins for body, Fraunces for
   display headings. (undo: uncomment the Geist block below and delete this
   Poppins/Fraunces one) */
import { Poppins, Fraunces } from "next/font/google";
import "@/app/globals.css";
import {AuthProvider} from "@/context/AuthContext"
import { CustomerCartBoundary } from "@/components/CustomerCartBoundary"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {

  title: "BurgerHouse — Burgers made to make you smile",
  description: "Juicy, flame-grilled burgers with fresh ingredients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html

      className={`${poppins.variable} ${fraunces.variable} h-full antialiased`}
    >

      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <AuthProvider>
          <CustomerCartBoundary>{children}</CustomerCartBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
