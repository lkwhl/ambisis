"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";

export default function NovaLicencaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaIdQuery = searchParams.get("empresaId");

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [form, setForm] = useState({
    empresaId: empresaIdQuery || "",
    numero: "",
    orgaoAmbiental: "",
    emissao: "",
    validade: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/empresas")
      .then((res) => res.json())
      .then(setEmpresas);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/licencas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Licença criada com sucesso");
      router.push(`/dashboard/licencas`);
    } else {
      toast.error("Erro ao criar licenca");
    }

    setLoading(false);
  };

  return (
    <>
      <Breadcrumb />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Nova Licença Ambiental
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

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--primary)] text-white px-6 py-2 rounded-md shadow hover:bg-[var(--gray)]"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
