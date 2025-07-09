# Projeto CRUD - Empresas e Licenças Ambientais

Este projeto foi desenvolvido como parte do processo seletivo da Ambisis e tem o objetivo de atender os requisitos informados.

---

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/)

---

## ⚙️ Setup do Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/lkwhl/ambisis.git
cd ambisis
```

### 2. Copiar variáveis de ambiente

```bash
cp .env-example .env
```

---

## 🐳 Subir o banco de dados com Docker + rodar migrations + iniciar o projeto

```bash
# Subir o container MySQL
docker-compose up -d

# Instalar dependências do projeto
npm install

# Rodar as migrations (Drizzle ORM)
npx drizzle-kit push

# Iniciar o projeto Next.js em modo desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## ✅ Scripts úteis

```bash
# Subir o banco de dados
docker-compose up -d

# Derrubar o banco de dados e apagar dados
docker-compose down -v

# Aplicar as migrations
npx drizzle-kit push

# Rodar o projeto
npm run dev
```

---

## 📁 Estrutura importante

```
.env                  ← Variáveis de ambiente
drizzle.config.ts     ← Configuração do Drizzle ORM
src/db/schema.ts      ← Definição das tabelas
docker-compose.yml    ← Banco de dados MySQL containerizado
```

---

## 🧑‍💻 Autor

Lucas Kühl dos Santos
