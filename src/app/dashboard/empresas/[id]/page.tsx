"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";

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
  const [erro, setErro] = useState("");

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
        setErro("CEP não encontrado");
      }
    } catch {
      setErro("Erro ao buscar CEP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const res = await fetch(`/api/empresas/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/dashboard/empresas");
    } else {
      setErro("Erro ao atualizar empresa");
    }
  };

  const handleNovaLicenca = () => {
    router.push(`/dashboard/licencas/nova?empresaId=${id}`);
  };

  const handleEditarLicenca = (licencaId: number) => {
    router.push(`/dashboard/licencas/${licencaId}`);
  };

  const handleDeletarLicenca = async (licencaId: number) => {
    await fetch(`/api/licencas/${licencaId}`, { method: "DELETE" });
    setLicencas((prev) => prev.filter((l) => l.id !== licencaId));
  };

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <>
      <Breadcrumb />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Editar Empresa</h1>
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

          {erro && <p className="col-span-2 text-red-600">{erro}</p>}

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className=" bg-[var(--primary)] text-white px-6 py-2 rounded-md shadow hover:bg-[var(--gray)]"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

        <div className="mt-10">
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
                  className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
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
