import type { Metadata, Viewport } from "next";
import { Google_Sans, Inter } from "next/font/google";
import Script from "next/script";
import { asset } from "@/lib/base-path";
import { tabIcon32 } from "@/lib/tab-icon";
import "./globals.css";

const googleSans = Google_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-google-sans",
});

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Leo — проверенные реабилитационные центры",
  description:
    "Подбор проверенных реабилитационных центров для лечения и восстановления при зависимостях.",
  icons: {
    icon: [
      { url: tabIcon32, type: "image/png", sizes: "32x32" },
      { url: `${asset("/brand/mark-v6-32.png")}?v=6`, type: "image/png", sizes: "32x32" },
      { url: `${asset("/brand/mark-v6-192.png")}?v=6`, type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: `${asset("/brand/mark-v6-180.png")}?v=6`, sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: tabIcon32, type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#d2def3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${googleSans.variable} ${inter.variable} h-full bg-[#d2def3] antialiased`}
    >
      <body className="min-h-full bg-[#fdfdfd] text-[#111]">
        <Script id="keep-top-on-reload" strategy="beforeInteractive">
          {`try{history.scrollRestoration="manual"}catch(e){}var nav=performance.getEntriesByType("navigation")[0];if(nav&&nav.type==="reload"){if(location.hash)history.replaceState(null,"",location.pathname+location.search);scrollTo(0,0)}`}
        </Script>
        <div className="overflow-x-clip">{children}</div>
      </body>
    </html>
  );
}
