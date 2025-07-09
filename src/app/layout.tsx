import Sidebar from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex h-screen overflow-hidden font-sans bg-gray-100 text-gray-800">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
          {children}
          <Toaster position="top-right" />
        </main>
      </body>
    </html>
  );
}
