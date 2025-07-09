'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean).slice(1);

  const [extraLabel, setExtraLabel] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (parts.length === 2 && parts[0] === 'empresas') {
        const res = await fetch(`/api/empresas/${parts[1]}`);
        const data = await res.json();
        if (data?.razaoSocial) setExtraLabel(data.razaoSocial);
      }

      if (parts.length === 3 && parts[0] === 'licencas' && parts[2] === 'editar') {
        const res = await fetch(`/api/licencas/${parts[1]}`);
        const data = await res.json();
        if (data?.numero) setExtraLabel(data.numero);
      }
    };

    fetchData();
  }, [pathname, parts]);

  return (
    <nav className="text-sm text-gray-600 mb-4 sm:mb-6 px-4 sm:px-0 block">
      <span className="text-gray-400">Home / </span>
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const href = '/' + ['dashboard', ...parts.slice(0, index + 1)].join('/');

        const label = (() => {
          if (parts[0] === 'empresas' && parts.length === 2 && isLast && extraLabel) {
            return extraLabel;
          }

          if (parts[0] === 'licencas' && parts.length === 3 && isLast && extraLabel) {
            return extraLabel;
          }

          return decodeURIComponent(part)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
        })();

        return (
          <span key={href}>
            {isLast ? (
              <span className="font-semibold">{label}</span>
            ) : (
              <Link href={href} className="hover:underline text-blue-600">
                {label}
              </Link>
            )}
            {index < parts.length - 1 && ' / '}
          </span>
        );
      })}
    </nav>
  );
}
