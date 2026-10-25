import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ptSans = localFont({
  src: [
    { path: "../fonts/PTSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/PTSans-Italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/PTSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/PTSans-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-pt-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Проверенные ребцентра",
  description:
    "Подбор проверенных реабилитационных центров для лечения и восстановления при зависимостях.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${ptSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#111]">{children}</body>
    </html>
  );
}
