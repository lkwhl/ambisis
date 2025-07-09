import db from "@/db";
import { licencas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: { id: string } }) {
  const id = Number(context.params.id);
  const licenca = await db.select().from(licencas).where(eq(licencas.id, id));
  return NextResponse.json(licenca[0] || null);
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const id = Number(context.params.id);
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

  await db
    .update(licencas)
    .set({
      empresaId: body.empresaId,
      numero: body.numero,
      orgaoAmbiental: body.orgaoAmbiental,
      emissao: dataEmissao,
      validade: dataValidade,
    })
    .where(eq(licencas.id, id));

  return NextResponse.json({ message: "Licença atualizada com sucesso" });
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const id = Number(context.params.id);
  await db.delete(licencas).where(eq(licencas.id, id));
  return NextResponse.json({ message: "Licença removida com sucesso" });
}
