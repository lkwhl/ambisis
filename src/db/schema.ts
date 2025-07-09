import { mysqlTable, int, varchar, date } from "drizzle-orm/mysql-core";

export const empresas = mysqlTable("empresas", {
  id: int("id").primaryKey().autoincrement(),
  razaoSocial: varchar("razao_social", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull(),
  cep: varchar("cep", { length: 9 }).notNull(),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  estado: varchar("estado", { length: 2 }).notNull(),
  bairro: varchar("bairro", { length: 100 }).notNull(),
  complemento: varchar("complemento", { length: 255 }),
});

export const licencas = mysqlTable("licencas", {
  id: int("id").primaryKey().autoincrement(),
  empresaId: int("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  numero: varchar("numero", { length: 100 }).notNull(),
  orgaoAmbiental: varchar("orgao_ambiental", { length: 100 }).notNull(),
  emissao: date("emissao").notNull(),
  validade: date("validade").notNull(),
});
