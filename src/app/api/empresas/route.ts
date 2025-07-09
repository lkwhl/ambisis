import { NextResponse } from "next/server";
import db from "@/db";
import { empresas } from "@/db/schema";

export async function GET() {
  const data = await db.select().from(empresas);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const nova = await db.insert(empresas).values({
    razaoSocial: body.razaoSocial,
    cnpj: body.cnpj,
    cep: body.cep,
    cidade: body.cidade,
    estado: body.estado,
    bairro: body.bairro,
    complemento: body.complemento,
  });

  return NextResponse.json(nova, { status: 201 });
}
