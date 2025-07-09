import { NextResponse } from "next/server";
import db from "@/db";
import { empresas } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(empresas);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { cnpj, razaoSocial, cep, cidade, estado, bairro, complemento } = body;

  const empresaExistente = await db
    .select()
    .from(empresas)
    .where(eq(empresas.cnpj, cnpj));

  if (empresaExistente.length > 0) {
    return NextResponse.json(
      { error: "Já existe uma empresa com esse CNPJ" },
      { status: 409 }
    );
  }

  const nova = await db.insert(empresas).values({
    razaoSocial,
    cnpj,
    cep,
    cidade,
    estado,
    bairro,
    complemento,
  });

  return NextResponse.json(nova, { status: 201 });
}
