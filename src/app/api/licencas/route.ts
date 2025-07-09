import { NextResponse } from "next/server";
import db from "@/db";
import { licencas } from "@/db/schema";

export async function GET() {
  const data = await db.select().from(licencas);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const dataEmissao = new Date(body.emissao);
  const dataValidade = new Date(body.validade);

  if (isNaN(dataEmissao.getTime()) || isNaN(dataValidade.getTime())) {
    return NextResponse.json(
      { error: "Datas de emissão ou validade inválidas" },
      { status: 400 }
    );
  }

  if (dataEmissao >= dataValidade) {
    return NextResponse.json(
      { error: "A data de emissão deve ser anterior à validade" },
      { status: 400 }
    );
  }

  const nova = await db.insert(licencas).values({
    empresaId: body.empresaId,
    numero: body.numero,
    orgaoAmbiental: body.orgaoAmbiental,
    emissao: dataEmissao,
    validade: dataValidade,
  });

  return NextResponse.json(nova, { status: 201 });
}
