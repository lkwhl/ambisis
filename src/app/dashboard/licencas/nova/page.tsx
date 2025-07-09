'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NovaLicencaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaIdQuery = searchParams.get('empresaId');

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [form, setForm] = useState({
    empresaId: empresaIdQuery || '',
    numero: '',
    orgaoAmbiental: '',
    emissao: '',
    validade: '',
  });

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/empresas')
      .then((res) => res.json())
      .then(setEmpresas);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    const res = await fetch('/api/licencas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push(`/dashboard/empresas/${form.empresaId}`);
    } else {
      setErro('Erro ao criar licença');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Licença Ambiental</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Empresa</label>
          <select
            name="empresaId"
            value={form.empresaId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Selecione...</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.razaoSocial}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Número da Licença</label>
          <input
            type="text"
            name="numero"
            value={form.numero}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Órgão Ambiental</label>
          <input
            type="text"
            name="orgaoAmbiental"
            value={form.orgaoAmbiental}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">Data de Emissão</label>
            <input
              type="date"
              name="emissao"
              value={form.emissao}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium">Data de Validade</label>
            <input
              type="date"
              name="validade"
              value={form.validade}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {erro && <p className="text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
