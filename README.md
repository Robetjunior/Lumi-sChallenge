# Lumi - Teste Técnico Desenvolvedor Full Stack (Back-end)

Este projeto foi desenvolvido como parte do **Teste Técnico para Desenvolvedor Full Stack Pleno** da Lumi. O objetivo deste desafio foi desenvolver uma API robusta que realiza o parse de faturas de energia elétrica, armazena os dados relevantes em um banco de dados PostgreSQL e os disponibiliza para uma aplicação web.

> **Nota:** O trabalho submetido para este teste não será utilizado para fins comerciais ou integrado aos produtos da Lumi. Seu propósito é exclusivamente avaliativo.

## Descrição do Desafio

O desafio consiste em:

- **Extração de Dados:** Desenvolver um extrator para capturar os dados relevantes das faturas de energia elétrica, como número do cliente, mês de referência, consumo de energia, valores faturados, energia compensada e contribuições.
- **Modelagem e Persistência:** Organizar e armazenar esses dados de forma estruturada em um banco de dados PostgreSQL, utilizando um ORM (Sequelize) para facilitar a interação.
- **Criação de uma API RESTful:** Construir uma API utilizando Node.js e Express (ou NestJS) para permitir a criação, leitura, atualização e deleção de faturas, além de fornecer dados agregados para um dashboard.
- **Upload de Arquivos:** Permitir o upload dos arquivos PDF das faturas, utilizando bibliotecas como `multer` e `pdf-parse` para extrair as informações necessárias.

## Tecnologias Utilizadas

- **Back-end:** Node.js, Express, TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Sequelize
- **Ferramentas e Bibliotecas:**
  - `dotenv` para gerenciamento de variáveis de ambiente.
  - `pdf-parse` para extração de dados dos PDFs.
  - `multer` para upload de arquivos.
  - `cors` para configuração de CORS.
  - Outras dependências comuns (body-parser, etc).

## Funcionalidades

1. **Extração e Processamento de Dados:**  
   - Realiza o parse dos arquivos PDF das faturas e extrai informações chave (ex: número do cliente, mês de referência, kWh, valores, etc).
   - Calcula variáveis derivadas, como consumo total de energia e economia GD.

2. **Banco de Dados:**  
   - Armazena os dados extraídos em um banco PostgreSQL.
   - Utiliza o Sequelize para definir modelos e facilitar as operações CRUD.

3. **API RESTful:**  
   - Endpoints para criação, leitura, atualização e deleção de faturas.
   - Endpoints adicionais para fornecer dados agregados para o dashboard.
   - Tratamento de erros por meio de middlewares.

4. **Upload de Arquivos:**  
   - Suporta o upload de faturas em PDF, com processamento automático para extração dos dados.

5. **Testes Automatizados:**  
   - Testes unitários e de integração para validar a extração dos PDFs, persistência dos dados e funcionamento dos endpoints.

## Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/SeuUsuario/SeuRepositorio.git
cd SeuRepositorio/backend
```

### 2. Instalar as Dependências

No diretório do backend, execute:

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do diretório backend e configure as seguintes variáveis:

env
```bash
DB_USERNAME=postgres
DB_PASSWORD=Mf8prweM5f71RXFu
DB_DATABASE=postgres
DB_HOST=db.atvtfhsozmrogcxvnecp.supabase.co
DB_PORT=5432
DB_DIALECT=postgres
```
Observação: Utilize as configurações adequadas para seu ambiente, se necessário.

### 4. Executar o Servidor em Desenvolvimento
Para iniciar o servidor backend, execute:

```bash
npm run dev
```
A API ficará disponível em http://localhost:3001.

### 5. Testar a API
Utilize uma ferramenta como curl ou Postman para testar os endpoints. Por exemplo, para listar todas as faturas:

```bash
curl http://localhost:3001/api/invoices
```

### Endpoints Principais

- **GET /api/invoices** – Retorna todas as faturas.
- **POST /api/invoices** – Cria uma nova fatura a partir de um arquivo PDF.
- **GET /api/invoices/:id** – Retorna os detalhes de uma fatura específica.
- **PUT /api/invoices/:id** – Atualiza uma fatura existente.
- **DELETE /api/invoices/:id** – Deleta uma fatura.
- **GET /api/invoices/dashboard** – Retorna dados agregados para o dashboard.
- Outros endpoints (como `/calculos/:no_cliente/:mes_referencia`, `/search`, `/importar-pasta`) conforme necessário.

### 6. Estrutura do Projeto

```bash
backend/
├── src/                      # Código-fonte principal
│   ├── config/               # Configurações da aplicação
│   ├── controllers/          # Controladores da API
│   ├── middlewares/          # Middlewares (ex: errorHandler)
│   ├── models/               # Modelos do Sequelize
│   ├── routes/               # Rotas da API
│   ├── services/             # Lógica de negócio e extração de dados
│   └── utils/                # Funções auxiliares (ex: parseNumber)
├── .env                      # Variáveis de ambiente
├── package.json              # Gerenciamento de dependências e scripts
├── README.md                 # Documentação do projeto
└── tsconfig.json             # Configurações do TypeScript
```

7. Testes
Para executar os testes do backend, utilize:

```bash
npm test
```

### 8. Deploy

A API pode ser implantada em plataformas como Heroku, Render ou Vercel. Se a aplicação estiver hospedada, inclua o link para acesso público aqui.

### Autor

**José Roberto Ferreira Junio**  
[LinkedIn](https://www.linkedin.com/in/jos%C3%A9-roberto-dev/)