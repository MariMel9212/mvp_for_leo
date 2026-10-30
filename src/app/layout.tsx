import type { Metadata } from "next";
import { Google_Sans, Inter } from "next/font/google";
import Script from "next/script";
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
  title: "СвойЦентр — проверенные ребцентра",
  description:
    "Подбор проверенных реабилитационных центров для лечения и восстановления при зависимостях.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${googleSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#fdfdfd] text-[#111]">
        <Script id="keep-top-on-reload" strategy="beforeInteractive">
          {`try{history.scrollRestoration="manual"}catch(e){}if(location.hash)history.replaceState(null,"",location.pathname+location.search);scrollTo(0,0)`}
        </Script>
        {children}
      </body>
    </html>
  );
}
