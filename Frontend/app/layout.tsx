import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Million',
  description: 'Frontend de propiedades',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#fafafa] text-gray-800 relative font-sans">
        <div className="fixed inset-0 z-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/marble.png')] opacity-5"></div>

        <header className="relative z-10 w-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white shadow-lg py-5 border-b border-slate-400/30 backdrop-blur-md">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-slate-100">
              Million
            </h1>
            <span className="italic text-slate-300">Tu espacio ideal</span>
          </div>
        </header>

        <main className="relative z-10 container mx-auto px-6 py-10">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200/60">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
