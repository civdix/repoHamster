import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'DebugLab | AI-Assisted Debugging Assessment Platform',
  description:
    'Real-world technical debugging assessment platform powered by GitHub Codespaces, automated multi-stage evaluation engines, and controlled AI assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-accent-cyan/30 selection:text-white">
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-card-border bg-[#070a12] py-6 text-center text-xs text-slate-500">
              <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-300">DebugLab Assessment Platform</span>
                  <span>•</span>
                  <span>Isolated Evaluation Worker Engine</span>
                </div>
                <div className="font-mono text-slate-600">
                  Secure GitHub OAuth & Webhook Verification
                </div>
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
