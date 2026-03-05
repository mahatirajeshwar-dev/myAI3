import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A.I.R.A. | ABIS Internal Resource Assistant",
  description: "Employee support chatbot for ABIS Food Pvt Ltd",
};

<<<<<<< HEAD
import { Toaster } from "sonner";

=======
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
=======
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>{children}</body>
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
    </html>
  );
}
