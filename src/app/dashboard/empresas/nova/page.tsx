"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function NovaEmpresaPage() {
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

  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const res = await fetch("/api/empresas", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Empresa criada com sucesso");
      router.push("/dashboard/empresas");
    } else {
      toast.error("Erro ao criar empresa");
    }

    setLoading(false);
  };

  return (
    <>
      <Breadcrumb />
      <div className="px-4 sm:px-0 py-2 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-800">
            Cadastrar Empresa
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
                minLength={campo === "cep" ? 8 : 0}
                maxLength={campo === "cep" ? 8 : 255}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required={["razaoSocial", "cnpj", "cep"].includes(campo)}
                disabled={["cidade", "estado", "bairro"].includes(campo)}
              />
            </div>
          ))}
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
