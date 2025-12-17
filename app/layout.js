import { Rubik } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";
import Footer from "@/components/Footer";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
});

export const metadata = {
  title: "Recovery Log",
  description: "Recover your digital life",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${rubik.className} antialiased text-gray-900 min-h-screen flex flex-col`}>
        <Providers>
          <SplashScreen />
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
