import { NextResponse } from "next/server";
import db from "@/db";
import { licencas } from "@/db/schema";

export async function GET() {
  const data = await db.select().from(licencas);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const nova = await db.insert(licencas).values({
    empresaId: body.empresaId,
    numero: body.numero,
    orgaoAmbiental: body.orgaoAmbiental,
    emissao: new Date(body.emissao),
    validade: new Date(body.validade),
  });

  return NextResponse.json(nova, { status: 201 });
}
