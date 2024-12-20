import type { Metadata } from "next";
// Providers
import { Providers } from "../../providers";
import { Toaster } from "@/components/ui/toaster";
import MobileCartButton from "@/components/MobileCartButton";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Restraurant",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <Navbar />
      {children}
      {/* <Footer /> */}
      <MobileCartButton />
      <Toaster />
    </Providers>
  );
}
