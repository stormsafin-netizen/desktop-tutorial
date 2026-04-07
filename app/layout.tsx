import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '製造指図記録書 GMP検証システム',
  description: '製造指図記録書のPDFをアップロードして、GMP準拠を自動検証します',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
