import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import RevealObserver from "@/components/RevealObserver";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Nourished by Mitchell · Nutritionist in Nairobi",
    template: "%s · Nourished by Mitchell",
  },
  description:
    "Personalised meal plans, nutrition coaching, clinical nutrition and corporate wellness by Mitchell, a nutritionist in Nairobi, Kenya. Get your free starter meal plan.",
  icons: { icon: "/images/logo.jpg" },
  openGraph: {
    title: "Nourished by Mitchell",
    description: "Personalised nutrition from Nairobi. Get your free starter meal plan.",
    images: ["/images/logo.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${manrope.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <RevealObserver />
      </body>
    </html>
  );
}
