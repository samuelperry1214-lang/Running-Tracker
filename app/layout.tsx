import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'British Running Tracker',
  description: 'Track British and international athletics — calendar, results, and news in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream antialiased">
        {children}
      </body>
    </html>
  );
}
