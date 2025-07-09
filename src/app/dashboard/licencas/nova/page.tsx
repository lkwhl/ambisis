"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

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
      if (empresaIdQuery) {
        router.push(`/dashboard/empresas/${empresaIdQuery}`);
      } else {
        router.push(`/dashboard/licencas`);
      }
    } else {
      const data = await res.json();
      toast.error(data?.error || "Erro ao criar licença");
    }

    setLoading(false);
  };

  return (
    <>
      <Breadcrumb />
      <div className="px-4 sm:px-0 py-2 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-800">
            Nova Licença Ambiental
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl shadow-md"
        >
          <div className="col-span-1 sm:col-span-2">
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

          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
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

          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
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
            <label className="block mb-1 text-sm font-medium text-gray-700">
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
            <label className="block mb-1 text-sm font-medium text-gray-700">
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

          <div className="col-span-1 sm:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--primary)] text-white px-6 py-2 rounded-md shadow hover:brightness-110 transition w-full sm:w-auto"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
