import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';

export const metadata: Metadata = {
  title: '배드민턴 마스터 PWA - 입문 가이드 & 4주 훈련 루틴',
  description: '배드민턴 입문자를 위한 기초 매뉴얼과 4주 완성 인터랙티브 훈련 루틴 타이머 PWA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '배드민턴 마스터',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D1117',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="app-container">
          <Header />
          <main className="main-content">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
