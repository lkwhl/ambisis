"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Loading from "@/components/Loading";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .finally(() => setLoading(false));
  }, []);

  const handleNovaEmpresa = () => {
    router.push("/dashboard/empresas/nova");
  };

  const handleEditar = (id: number) => {
    router.push(`/dashboard/empresas/${id}`);
  };

  if (loading) return <Loading title="Carregando Empresas" />;

  return (
    <>
      <Breadcrumb />
      <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Empresas
          </h1>
          <button
            onClick={handleNovaEmpresa}
            className="bg-gradient-to-tr from-[#5e72e4] to-[#825ee4] text-white px-5 py-3 text-sm rounded-lg shadow hover:brightness-105 transition"
          >
            Nova Empresa
          </button>
        </div>

        {empresas.length === 0 ? (
          <p className="text-gray-500">Nenhuma empresa cadastrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {empresas.map((empresa) => (
              <Card
                key={empresa.id}
                title={empresa.razaoSocial}
                onClick={() => handleEditar(empresa.id)}
              >
                <p className="text-sm sm:text-base text-gray-600">
                  CNPJ: {empresa.cnpj}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
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
