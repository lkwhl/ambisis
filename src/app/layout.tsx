import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex h-screen overflow-hidden font-sans bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm p-6 space-y-4 hidden md:block text-gray-900">
          <h1 className="text-xl font-bold mb-6">Ambisis</h1>
          <nav className="space-y-2">
            <Link href="/dashboard/empresas" className="block hover:text-blue-600">Empresas</Link>
            <Link href="/dashboard/licencas" className="block hover:text-blue-600">Licenças</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
