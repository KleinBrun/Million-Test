import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Million Frontend',
  description: 'Frontend de propiedades lujosas',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 relative">
        {/* Overlay vectorial sutil */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <img
            src="https://www.transparenttextures.com/patterns/diagmonds.png"
            className="w-full h-full opacity-5 object-cover"
            alt="pattern"
          />
        </div>

        {/* Navbar */}
        <header className="w-full bg-blue-950 text-white py-6 shadow-xl relative z-10">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
              Million
            </h1>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
