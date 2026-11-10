import type { Metadata, Viewport } from "next";
import { Google_Sans, Inter } from "next/font/google";
import Script from "next/script";
import { asset } from "@/lib/base-path";
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
      { url: asset("/favicon-v10.svg"), type: "image/svg+xml", sizes: "any" },
      { url: asset("/favicon-v10.ico"), type: "image/x-icon", sizes: "32x32" },
      { url: asset("/brand/tab-v10.png"), type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: asset("/brand/tab-v10-180.png"), sizes: "180x180", type: "image/png" }],
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
