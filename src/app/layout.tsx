import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";

const googleSans = Google_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "СвойЦентр — проверенные ребцентра",
  description:
    "Подбор проверенных реабилитационных центров для лечения и восстановления при зависимостях.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${googleSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#111]">{children}</body>
    </html>
  );
}
