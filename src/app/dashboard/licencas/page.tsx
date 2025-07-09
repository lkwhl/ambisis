'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';

type Licenca = {
  id: number;
  numero: string;
  orgaoAmbiental: string;
  emissao: string;
  validade: string;
  empresaId: number;
};

type Empresa = {
  id: number;
  razaoSocial: string;
};

export default function LicencasPage() {
  const [licencas, setLicencas] = useState<Licenca[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/licencas').then((res) => res.json()).then(setLicencas);
    fetch('/api/empresas').then((res) => res.json()).then(setEmpresas);
  }, []);

  const getEmpresaNome = (id: number) =>
    empresas.find((e) => e.id === id)?.razaoSocial || 'Desconhecida';

  const handleNovaLicenca = () => {
    router.push('/dashboard/licencas/nova');
  };

  const handleEditar = (id: number) => {
    router.push(`/dashboard/licencas/${id}/editar`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Breadcrumb />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Licenças</h1>
        <button
          onClick={handleNovaLicenca}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nova Licença
        </button>
      </div>

      {licencas.length === 0 ? (
        <p className="text-gray-500">Nenhuma licença cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licencas.map((licenca) => (
            <div
              key={licenca.id}
              onClick={() => handleEditar(licenca.id)}
              className="p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{licenca.numero}</h2>
              <p className="text-sm text-gray-600">
                <strong>Empresa:</strong> {getEmpresaNome(licenca.empresaId)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Órgão:</strong> {licenca.orgaoAmbiental}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Emissão:</strong> {new Date(licenca.emissao).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Validade:</strong> {new Date(licenca.validade).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
