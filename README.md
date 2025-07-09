# Projeto CRUD - Empresas e Licenças Ambientais

Este projeto foi desenvolvido como parte do processo seletivo da Ambisis e tem o objetivo de atender os requisitos informados.

---

## 🚀 Tecnologias Utilizadas

* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Drizzle ORM](https://orm.drizzle.team/)
* [MySQL](https://www.mysql.com/)
* [Docker](https://www.docker.com/)

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

Configure os valores do `.env` conforme necessário.

---

## 🐳 Ambiente de Desenvolvimento

```bash
# Subir o container MySQL
docker-compose up -d

# Instalar dependências
npm install

# Rodar as migrations (Drizzle ORM)
npx drizzle-kit push

# Iniciar o projeto em modo desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📦 Build e Execução em Produção com Docker

Este projeto está preparado para rodar em produção com Docker.

### 1. Build da imagem de produção

```bash
docker build -t ambisis-app .
```

---

## ✅ Scripts úteis

```bash
# Subir o banco de dados
docker-compose up -d

# Derrubar o banco de dados e apagar os volumes
docker-compose down -v

# Rodar as migrations
npx drizzle-kit push

# Iniciar o projeto em modo desenvolvimento
npm run dev

# Gerar build para produção
npm run build

# Rodar em produção (fora do Docker)
npm run start
```

---

## 📁 Estrutura importante

```
.env                  ← Variáveis de ambiente
Dockerfile            ← Build da aplicação para produção
drizle.config.ts      ← Configuração do Drizzle ORM
src/db/schema.ts      ← Definição das tabelas
docker-compose.yml    ← Banco de dados MySQL containerizado
```

---

## 🧑‍💻 Autor

Lucas Kühl dos Santos
