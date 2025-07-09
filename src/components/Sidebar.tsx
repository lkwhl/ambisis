'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, FileText } from 'lucide-react';

const navItems = [
  {
    label: 'Empresas',
    href: '/dashboard/empresas',
    icon: <Building className="w-4 h-4 mr-2" />,
  },
  {
    label: 'Licenças',
    href: '/dashboard/licencas',
    icon: <FileText className="w-4 h-4 mr-2" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white rounded-2xl shadow-md border border-gray-200 hidden md:flex flex-col justify-between overflow-y-auto mt-4 mb-4 ml-4 h-[calc(100vh-2rem)]">
      <div>
        <div className="flex items-center justify-center py-6 border-b">
          <span className="text-xl font-bold text-[#5e72e4]">Ambisis</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${active
                        ? 'bg-gradient-to-tr from-[#5e72e4] to-[#825ee4] !text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[#5e72e4]'}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
