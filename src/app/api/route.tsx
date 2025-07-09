import { NextResponse } from "next/server";
import db from "@/db";

export async function GET() {
    try {
        await db.execute("SELECT 1");
        return NextResponse.json(
            {
                message: "Banco de dados conectado",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Falha ao conectar com o banco de dados",
                error: String(error),
            },
            { status: 500 }
        );
    }
}
