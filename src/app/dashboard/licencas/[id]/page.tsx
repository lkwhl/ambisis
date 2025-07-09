"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/Loading";
import { Empresa } from "@/types";

export default function EditarLicencaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState({
    empresaId: "",
    numero: "",
    orgaoAmbiental: "",
    emissao: "",
    validade: "",
  });

  const [empresaAtualId, setEmpresaAtualId] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
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

  const empresaVinculada = empresas.find(
    (e) => e.id.toString() === empresaAtualId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/licencas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Licença atualizada com sucesso");
      if (empresaVinculada && typeof window !== "undefined") {
        const veioEmpresa =
          new URLSearchParams(window.location.search).get("from") === "empresa";
        if (veioEmpresa) {
          return router.push(`/dashboard/empresas/${empresaVinculada.id}`);
        }
      }
      router.push(`/dashboard/licencas`);
    } else {
      const data = await res.json();
      toast.error(data?.error || "Erro ao atualizar licença");
    }
  };

  const handleExcluirLicenca = () => {
    setModalVisible(true);
  };

  const confirmarExclusao = async () => {
    const res = await fetch(`/api/licencas/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Licença excluída com sucesso");
      const from = new URLSearchParams(window.location.search).get("from");
      if (from === "empresa" && empresaVinculada) {
        return router.push(`/dashboard/empresas/${empresaVinculada.id}`);
      }

      router.push("/dashboard/licencas");
    } else {
      toast.error("Erro ao excluir licença");
    }
  };

  if (loading) return <Loading title="Carregando Licença" />;

  return (
    <>
      <Breadcrumb />
      <div className="px-4 sm:px-0 py-2 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-800">
            Editar Licença Ambiental
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

          <div className="col-span-1 sm:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={handleExcluirLicenca}
              className="bg-red-600 text-white px-6 py-2 rounded-md shadow hover:bg-red-700 w-full sm:w-auto"
            >
              Excluir Licença
            </button>
            <button
              type="submit"
              className="bg-[var(--primary)] text-white px-6 py-2 rounded-md shadow hover:brightness-110 w-full sm:w-auto"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

        {modalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Tem certeza que deseja excluir esta licença?
              </h2>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalVisible(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    setModalVisible(false);
                    await confirmarExclusao();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 px-4 sm:px-0">
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
