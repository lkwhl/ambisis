'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from "@/components/Breadcrumb";

export default function NovaEmpresaPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    razaoSocial: '',
    cnpj: '',
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    complemento: '',
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Máscara simples de CNPJ
    const formatted = name === 'cnpj'
      ? value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1.$2')
              .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
              .replace(/\.(\d{3})(\d)/, '.$1/$2')
              .replace(/(\d{4})(\d)/, '$1-$2').slice(0, 18)
      : value;

    setForm((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json`);
      const data = await res.json();

      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          cidade: data.localidade || '',
          estado: data.uf || '',
          bairro: data.bairro || '',
        }));
      } else {
        setErro('CEP não encontrado');
      }
    } catch {
      setErro('Erro ao buscar CEP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const res = await fetch('/api/empresas', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/dashboard/empresas');
    } else {
      setErro('Erro ao criar empresa');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Breadcrumb />
      <h1 className="text-2xl font-bold mb-6">Cadastrar Empresa</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['razaoSocial', 'cnpj', 'cep', 'cidade', 'estado', 'bairro', 'complemento'].map((campo) => (
          <div key={campo}>
            <label className="block font-medium capitalize">{campo}</label>
            <input
              type="text"
              name={campo}
              value={(form as any)[campo]}
              onChange={handleChange}
              onBlur={campo === 'cep' ? handleCepBlur : undefined}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required={['razaoSocial', 'cnpj', 'cep'].includes(campo)}
              disabled={['cidade', 'estado', 'bairro'].includes(campo)}
            />
          </div>
        ))}

        {erro && <p className="text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
