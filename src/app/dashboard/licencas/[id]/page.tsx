"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";

export default function EditarLicencaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [form, setForm] = useState({
    empresaId: "",
    numero: "",
    orgaoAmbiental: "",
    emissao: "",
    validade: "",
  });

  const [empresaAtualId, setEmpresaAtualId] = useState<string>("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/empresas")
      .then((res) => res.json())
      .then(setEmpresas);

    fetch(`/api/licencas/${id}`)
      .then((res) => res.json())
      .then((licenca) => {
        if (licenca) {
          const empresaIdStr = licenca.empresaId.toString();
          setEmpresaAtualId(empresaIdStr);
          setForm({
            empresaId: empresaIdStr,
            numero: licenca.numero,
            orgaoAmbiental: licenca.orgaoAmbiental,
            emissao: licenca.emissao?.slice(0, 10),
            validade: licenca.validade?.slice(0, 10),
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const res = await fetch(`/api/licencas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push(`/dashboard/empresas/${form.empresaId}`);
    } else {
      setErro("Erro ao atualizar licença");
    }
  };

  const empresaVinculada = empresas.find(
    (e) => e.id.toString() === empresaAtualId
  );

  if (loading) return <p className="p-6">Carregando licença...</p>;

  return (
    <>
      <Breadcrumb />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Editar Licença Ambiental
          </h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:underline"
          >
            Voltar
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md"
        >
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Empresa <span className="text-red-500">*</span>
            </label>
            <select
              name="empresaId"
              value={form.empresaId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Selecione uma empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.razaoSocial}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Número da Licença
            </label>
            <input
              type="text"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Órgão Ambiental
            </label>
            <input
              type="text"
              name="orgaoAmbiental"
              value={form.orgaoAmbiental}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Emissão
            </label>
            <input
              type="date"
              name="emissao"
              value={form.emissao}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Validade
            </label>
            <input
              type="date"
              name="validade"
              value={form.validade}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {erro && <p className="col-span-2 text-red-600">{erro}</p>}

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-[var(--primary)] text-white px-6 py-2 rounded-md shadow hover:bg-[var(--gray)]"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Empresa Vinculada
          </h2>
          {empresaVinculada ? (
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="font-medium text-gray-800">
                {empresaVinculada.razaoSocial}
              </p>
              <button
                onClick={() =>
                  router.push(`/dashboard/empresas/${empresaVinculada.id}`)
                }
                className="text-blue-600 hover:underline"
              >
                Editar Empresa
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Empresa não encontrada.</p>
          )}
        </div>
      </div>
    </>
  );
}
