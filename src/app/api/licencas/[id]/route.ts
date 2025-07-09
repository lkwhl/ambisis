import db from "@/db";
import { licencas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const licenca = await db.select().from(licencas).where(eq(licencas.id, id));
  return NextResponse.json(licenca[0] || null);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();

  await db
    .update(licencas)
    .set({
      empresaId: body.empresaId,
      numero: body.numero,
      orgaoAmbiental: body.orgaoAmbiental,
      emissao: new Date(body.emissao),
      validade: new Date(body.validade),
    })
    .where(eq(licencas.id, id));

  return NextResponse.json({ message: "Licença atualizada" });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await db.delete(licencas).where(eq(licencas.id, id));
  return NextResponse.json({ message: "Licença removida" });
}
