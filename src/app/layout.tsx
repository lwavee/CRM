import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EliteOps Lead Intelligence Platform | Automated High-Intent Client Acquisition',
  description: 'AI-powered Lead Intelligence & Automated Client Acquisition Platform for EliteOps Global, targeting USA, Canada, UK, Australia, and UAE.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
