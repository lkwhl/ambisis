import db from "@/db";
import { empresas } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

// ✅ Corrigido: desestrutura diretamente `params`
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const empresa = await db.select().from(empresas).where(eq(empresas.id, id));
  return NextResponse.json(empresa[0] || null);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();

  const {
    razaoSocial,
    cnpj,
    cep,
    cidade,
    estado,
    bairro,
    complemento,
  } = body;

  const empresaComMesmoCNPJ = await db
    .select()
    .from(empresas)
    .where(and(eq(empresas.cnpj, cnpj), ne(empresas.id, id)));

  if (empresaComMesmoCNPJ.length > 0) {
    return NextResponse.json(
      { error: "Já existe uma empresa com esse CNPJ" },
      { status: 409 }
    );
  }

  await db
    .update(empresas)
    .set({
      razaoSocial,
      cnpj,
      cep,
      cidade,
      estado,
      bairro,
      complemento,
    })
    .where(eq(empresas.id, id));

  return NextResponse.json({ message: "Empresa atualizada com sucesso" });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  await db.delete(empresas).where(eq(empresas.id, id));
  return NextResponse.json({ message: "Empresa removida com sucesso" });
}
