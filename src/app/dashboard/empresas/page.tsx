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
    <>
      <Breadcrumb />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Empresas</h1>
          <button
            onClick={handleNovaEmpresa}
            className="bg-gradient-to-tr from-[#5e72e4] to-[#825ee4] text-white px-5 py-2 rounded-lg shadow hover:brightness-105 transition"
          >
            Nova Empresa
          </button>
        </div>

        {empresas.length === 0 ? (
          <p className="text-gray-500">Nenhuma empresa cadastrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </>
  );
}
