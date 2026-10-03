# iStore API

> ⚠️ **Projeto em construção** — esta API está em desenvolvimento ativo. Funcionalidades, contratos de endpoints e estrutura do banco podem mudar sem aviso até a primeira versão estável.

API REST para gestão de e-commerce de eletrônicos, construída com [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/) e PostgreSQL.

## Status

🚧 Em desenvolvimento — ainda não recomendado para uso em produção.

## Sumário

- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados](#banco-de-dados)
- [Executando o projeto](#executando-o-projeto)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Scripts disponíveis](#scripts-disponíveis)

## Stack

- **Runtime / Framework:** Node.js + NestJS 11
- **Linguagem:** TypeScript
- **ORM:** TypeORM
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT (Passport) + estratégia local
- **Validação:** class-validator / class-transformer
- **Documentação:** Swagger (OpenAPI)
- **E-mail:** Nodemailer
- **Hash de senha:** bcrypt

## Funcionalidades

- Autenticação com JWT (login, refresh token, esqueci/redefinir senha, alterar senha)
- Controle de acesso baseado em **roles** (`admin`, `team`, `client`) e **permissions** granulares (`create:user`, `read:user`, etc.)
- Guards de JWT e de permissões, com decorator `@Public()` para rotas abertas
- CRUD de usuários, endereços, telefones, roles, permissions e role-permissions
- Gestão de categorias com ordenação, status e vínculo de imagem
- Upload de imagens únicas e em lote (`multipart/form-data`) para categorias, produtos e tickets
- Cadastro público de cliente (`POST /users/client`)
- Paginação padronizada via helper e DTOs reutilizáveis
- Migrations e seeds via TypeORM CLI
- Envio de e-mail (recuperação de senha)

## Estrutura do projeto

```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── constants/        # Listas de permissões por role (admin, team, seller, client, dev)
│   ├── decorators/       # @Public, @RequirePermissions
│   ├── dto/              # PaginationDTO, PaginationMetaDTO
│   ├── guards/           # JwtGuard, PermissionGuard
│   ├── helpers/          # paginação, role-permission
│   ├── interfaces/       # PaginatedResponse, PaginationMeta
│   └── services/         # EmailService
├── database/
│   ├── data-source.ts
│   ├── migrations/
│   └── seeds/            # roles, permissions, role-permission, runner (seed.ts)
└── modules/
    ├── auth/             # login, refresh, change/forget/reset password
    ├── users/
    ├── roles/
    ├── permissions/
    ├── role_permissions/
    ├── categories/
    ├── cellphones/
    ├── address/
    └── images/           # upload de imagens única e em lote
```

## Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Instalação

```bash
git clone <repo-url>
cd istore_api
npm install
```

## Variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.example .env
```

Variáveis utilizadas:

| Variável       | Descrição                                            |
| -------------- | ---------------------------------------------------- |
| `DB_HOST`      | Host do PostgreSQL                                   |
| `DB_PORT`      | Porta do PostgreSQL (ex.: `5432`)                    |
| `DB_USERNAME`  | Usuário do banco                                     |
| `DB_PASSWORD`  | Senha do banco                                       |
| `DB_NAME`      | Nome do banco                                        |
| `JWT_SECRET`   | Segredo usado para assinar os tokens JWT             |
| `JWT_ACCESS`   | Tempo de expiração do access token (ex.: `15m`)      |
| `JWT_REFRESH`  | Tempo de expiração do refresh token (ex.: `7d`)      |
| `EMAIL_USER`   | Usuário SMTP usado pelo Nodemailer                   |
| `EMAIL_PASS`   | Senha/App password SMTP                              |
| `PORT`         | (opcional) Porta da API. Padrão: `3000`              |

## Banco de dados

O projeto usa migrations e seeds. `synchronize` está desabilitado — sempre rode as migrations.

```bash
# Gerar uma nova migration a partir das entidades
npm run migration:generate --name=NomeDaMigration

# Aplicar as migrations pendentes
npm run migration:run

# Reverter a última migration
npm run migration:revert

# Popular tabelas iniciais (roles, permissions, role-permissions)
npm run seed
```

## Executando o projeto

```bash
# desenvolvimento
npm run start

# desenvolvimento com hot-reload
npm run start:dev

# debug
npm run start:debug

# produção (após npm run build)
npm run build
npm run start:prod
```

A API sobe por padrão em `http://localhost:3000`.

## Documentação da API

### Swagger / OpenAPI (Interativo)

A documentação interativa gerada pelo Swagger com todos os endpoints, DTOs, schemas e códigos de retorno HTTP fica disponível em:

```
http://localhost:3000/api
```

#### Como testar endpoints protegidos no Swagger UI:
> ℹ️ O acesso à página do Swagger é livre e público para consulta. A autenticação abaixo é necessária apenas ao executar requisições em rotas protegidas diretamente pela interface.

1. Realize o login em `POST /auth/login` informando e-mail e senha para obter o `accessToken`.
2. Clique no botão **Authorize** (com ícone de cadeado no canto superior direito da página do Swagger).
3. No campo de valor, insira o token JWT gerado e confirme clicando em **Authorize**.
4. Agora você pode clicar em **"Try it out"** e testar as rotas protegidas com seu token ativo.

---

### Requisições REST Client (.http)

A pasta [http/](http/) também contém arquivos `.http` para testes rápidos via extensão REST Client do VS Code:

- [http/auth/auth.http](http/auth/auth.http)
- [http/users/user.http](http/users/user.http)
- [http/roles/role.http](http/roles/role.http)
- [http/permissions/permission.http](http/permissions/permission.http)
- [http/role_permissions/role_permission.http](http/role_permissions/role_permission.http)
- [http/categories/categories.http](http/categories/categories.http)
- [http/cellphones/cellphones.http](http/cellphones/cellphones.http)
- [http/address/address.http](http/address/address.http)

## Testes

```bash
# unitários
npm run test

# watch
npm run test:watch

# cobertura
npm run test:cov

# end-to-end
npm run test:e2e
```

## Scripts disponíveis

| Script                  | Descrição                                  |
| ----------------------- | ------------------------------------------ |
| `npm run start`         | Inicia a aplicação                         |
| `npm run start:dev`     | Inicia em modo watch                       |
| `npm run start:prod`    | Executa o build de produção                |
| `npm run build`         | Compila o projeto                          |
| `npm run lint`          | Executa o ESLint com `--fix`               |
| `npm run format`        | Formata o código com Prettier              |
| `npm run migration:run` | Aplica migrations pendentes                |
| `npm run seed`          | Roda os seeds do banco                     |
| `npm run test`          | Roda os testes unitários                   |
