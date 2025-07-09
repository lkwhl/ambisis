'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditarEmpresaPage() {
  const { id } = useParams();
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

  const [licencas, setLicencas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`/api/empresas/${id}`)
      .then((res) => res.json())
      .then((empresa) => {
        if (empresa) setForm(empresa);
      });

    fetch(`/api/licencas`)
      .then((res) => res.json())
      .then((todasLicencas) => {
        const filtradas = todasLicencas.filter((l: any) => l.empresaId === Number(id));
        setLicencas(filtradas);
      });

    setLoading(false);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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
    setErro('');

    const res = await fetch(`/api/empresas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/dashboard/empresas');
    } else {
      setErro('Erro ao atualizar empresa');
    }
  };

  const handleNovaLicenca = () => {
    router.push(`/dashboard/licencas/nova?empresaId=${id}`);
  };

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Empresa</h1>

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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Licenças Ambientais</h2>
        <button
          onClick={handleNovaLicenca}
          className="mb-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Nova Licença
        </button>

        {licencas.length === 0 ? (
          <p className="text-gray-500">Nenhuma licença cadastrada para esta empresa.</p>
        ) : (
          <ul className="space-y-2">
            {licencas.map((l) => (
              <li
                key={l.id}
                onClick={() => router.push(`/dashboard/licencas/${l.id}`)}
                className="border p-3 rounded hover:bg-gray-500 cursor-pointer"
              >
                <p><strong>Número:</strong> {l.numero}</p>
                <p><strong>Órgão:</strong> {l.orgaoAmbiental}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
