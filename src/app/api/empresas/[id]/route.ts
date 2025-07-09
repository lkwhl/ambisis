import db from "@/db";
import { empresas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const empresa = await db.select().from(empresas).where(eq(empresas.id, id));
  return NextResponse.json(empresa[0] || null);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();

  await db
    .update(empresas)
    .set({
      razaoSocial: body.razaoSocial,
      cnpj: body.cnpj,
      cep: body.cep,
      cidade: body.cidade,
      estado: body.estado,
      bairro: body.bairro,
      complemento: body.complemento,
    })
    .where(eq(empresas.id, id));

  return NextResponse.json({ message: "Empresa atualizada" });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await db.delete(empresas).where(eq(empresas.id, id));
  return NextResponse.json({ message: "Empresa removida" });
}
