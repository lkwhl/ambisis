"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/Loading";

export default function EditarEmpresaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    razaoSocial: "",
    cnpj: "",
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    complemento: "",
  });

  const [licencas, setLicencas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState<"empresa" | "licenca" | null>(
    null
  );
  const [licencaIdParaExcluir, setLicencaIdParaExcluir] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/empresas/${id}`)
      .then((res) => res.json())
      .then((empresa) => setForm(empresa));

    fetch(`/api/licencas`)
      .then((res) => res.json())
      .then((todasLicencas) => {
        const filtradas = todasLicencas.filter(
          (l: any) => l.empresaId === Number(id)
        );
        setLicencas(filtradas);
      });

    setLoading(false);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted =
      name === "cnpj"
        ? value
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .slice(0, 18)
        : value;
    setForm((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          cidade: data.localidade || "",
          estado: data.uf || "",
          bairro: data.bairro || "",
        }));
      } else {
        toast.error("CEP não encontrado");
      }
    } catch {
      toast.error("Erro ao buscar CEP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/empresas/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Empresa atualizada com sucesso");
      router.push("/dashboard/empresas");
    } else {
      const data = await res.json();
      toast.error(data?.error || "Erro ao atualizar empresa");
    }
  };

  const handleExcluirEmpresa = () => {
    setModalTipo("empresa");
    setModalVisible(true);
  };

  const handleDeletarLicenca = (id: number) => {
    setModalTipo("licenca");
    setLicencaIdParaExcluir(id);
    setModalVisible(true);
  };

  const handleConfirmExcluirEmpresa = async () => {
    const res = await fetch(`/api/empresas/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Empresa excluída com sucesso");
      router.push("/dashboard/empresas");
    } else {
      toast.error("Erro ao excluir empresa");
    }
  };

  const handleConfirmExcluirLicenca = async () => {
    if (!licencaIdParaExcluir) return;

    const res = await fetch(`/api/licencas/${licencaIdParaExcluir}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setLicencas((prev) => prev.filter((l) => l.id !== licencaIdParaExcluir));
      toast.success("Licença excluída com sucesso");
    } else {
      toast.error("Erro ao excluir licença");
    }
  };

  const handleNovaLicenca = () => {
    router.push(`/dashboard/licencas/nova?empresaId=${id}`);
  };

  const handleEditarLicenca = (licencaId: number) => {
    router.push(`/dashboard/licencas/${licencaId}`);
  };

  if (loading) return <Loading title="Carregando Empresa" />;

  return (
    <>
      <Breadcrumb />

      <div className="px-4 sm:px-0 py-2 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-800">Editar Empresa</h1>
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
          {[
            "razaoSocial",
            "cnpj",
            "cep",
            "cidade",
            "estado",
            "bairro",
            "complemento",
          ].map((campo) => (
            <div key={campo} className="col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
                {campo}
                {["razaoSocial", "cnpj", "cep"].includes(campo) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                name={campo}
                value={(form as any)[campo]}
                onChange={handleChange}
                onBlur={campo === "cep" ? handleCepBlur : undefined}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required={["razaoSocial", "cnpj", "cep"].includes(campo)}
                disabled={["cidade", "estado", "bairro"].includes(campo)}
              />
            </div>
          ))}

          <div className="col-span-1 sm:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={handleExcluirEmpresa}
              className="bg-red-600 text-white px-6 py-2 rounded-md shadow hover:bg-red-700 w-full sm:w-auto"
            >
              Excluir Empresa
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
                Tem certeza que deseja excluir{" "}
                {modalTipo === "empresa" ? "esta empresa" : "esta licença"}?
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
                    if (modalTipo === "empresa") {
                      await handleConfirmExcluirEmpresa();
                    } else if (modalTipo === "licenca") {
                      await handleConfirmExcluirLicenca();
                    }
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Licenças Ambientais
            </h2>
            <button
              onClick={handleNovaLicenca}
              className="bg-[var(--success)] text-white px-4 py-2 rounded-md hover:bg-[var(--gray)]"
            >
              Nova Licença
            </button>
          </div>

          {licencas.length === 0 ? (
            <p className="text-gray-500">
              Nenhuma licença cadastrada para esta empresa.
            </p>
          ) : (
            <ul className="space-y-4">
              {licencas.map((l) => (
                <li
                  key={l.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div className="mb-4 sm:mb-0">
                    <p className="font-semibold text-gray-800">
                      Número: <span className="text-gray-700">{l.numero}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Órgão: {l.orgaoAmbiental}
                    </p>
                    <p className="text-sm text-gray-600">
                      Emissão: {new Date(l.emissao).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditarLicenca(l.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletarLicenca(l.id)}
                      className="text-red-600 hover:underline"
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
