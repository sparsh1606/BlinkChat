import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "@/context/ChatContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BlinkChat | Chat App",
  description: "Blinkchat is a reacltime chat web application ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative min-h-screen bg-black overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, white 1.5px, transparent 1px)`,
              backgroundSize: "15px 15px",
            }}
          />

          {/* Top Left Pink/Red Blur */}
          <div className="absolute top-18 -left-1 w-150 h-150 bg-green-400 rounded-full blur-[80px] opacity-27"></div>

          {/* Bottom Right White Blur */}
          <div className="absolute bottom-2 -right-5 w-150 h-150 bg-green-400 rounded-full blur-[80px] opacity-26"></div>

          {/* Your Main Content */}

          <div className="relative z-10 h-screen flex items-center justify-center text-white px-4">
            <Toaster />
            <ChatProvider>{children}</ChatProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
