"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";

type Empresa = {
  id: number;
  razaoSocial: string;
  cnpj: string;
  cidade: string;
  estado: string;
};

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/empresas")
      .then((res) => res.json())
      .then(setEmpresas);
  }, []);

  const handleNovaEmpresa = () => {
    router.push("/dashboard/empresas/nova");
  };

  const handleEditar = (id: number) => {
    router.push(`/dashboard/empresas/${id}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Breadcrumb />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Empresas</h1>
        <button
          onClick={handleNovaEmpresa}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nova Empresa
        </button>
      </div>

      {empresas.length === 0 ? (
        <p className="text-gray-500">Nenhuma empresa cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {empresas.map((empresa) => (
            <Card
              key={empresa.id}
              title={empresa.razaoSocial}
              onClick={() => handleEditar(empresa.id)}
            >
              <p className="text-sm text-gray-600">CNPJ: {empresa.cnpj}</p>
              <p className="text-sm text-gray-600">
                {empresa.cidade} - {empresa.estado}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
