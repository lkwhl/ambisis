"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Loading from "@/components/Loading";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch("/api/licencas")
      .then((res) => res.json())
      .then(setLicencas);
    fetch("/api/empresas")
      .then((res) => res.json())
      .then(setEmpresas)
      .finally(() => setLoading(false));
  }, []);

  const getEmpresaNome = (id: number) =>
    empresas.find((e) => e.id === id)?.razaoSocial || "Desconhecida";

  const handleNovaLicenca = () => {
    router.push("/dashboard/licencas/nova");
  };

  const handleEditar = (id: number) => {
    router.push(`/dashboard/licencas/${id}`);
  };

  if (loading) return <Loading title="Carregando Licenças" />;

  return (
    <>
      <Breadcrumb />
      <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Licenças
          </h1>
          <button
            onClick={handleNovaLicenca}
            className="bg-gradient-to-tr from-[#5e72e4] to-[#825ee4] text-white px-5 py-3 text-sm rounded-lg shadow hover:brightness-105 transition"
          >
            Nova Licença
          </button>
        </div>

        {licencas.length === 0 ? (
          <p className="text-gray-500">Nenhuma licença cadastrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {licencas.map((licenca) => (
              <Card
                key={licenca.id}
                title={licenca.numero}
                onClick={() => handleEditar(licenca.id)}
              >
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Empresa:</strong> {getEmpresaNome(licenca.empresaId)}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Órgão:</strong> {licenca.orgaoAmbiental}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Emissão:</strong>{" "}
                  {new Date(licenca.emissao).toLocaleDateString()}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Validade:</strong>{" "}
                  {new Date(licenca.validade).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
