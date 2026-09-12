import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const plexKr = IBM_Plex_Sans_KR({
  variable: "--font-plex-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PLAINWORK — 매일 입는 남성 캐주얼",
  description:
    "PLAINWORK는 매일 입는 남성 캐주얼 8품목을 만듭니다. 원단과 핏을 확인하고 구매 문의를 남겨주세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${archivo.variable} ${plexKr.variable}`}>
      <body>{children}</body>
    </html>
  );
}
