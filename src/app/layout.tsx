import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  variable: "--font-source",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Проверенные ребцентра",
  description:
    "Подбор проверенных реабилитационных центров для лечения и восстановления при зависимостях.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${sourceSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#111]">{children}</body>
    </html>
  );
}
