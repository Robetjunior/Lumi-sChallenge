# Lumi - Teste Técnico Desenvolvedor Full Stack (Back-end)

Este projeto foi desenvolvido como parte do **Teste Técnico para Desenvolvedor Full Stack Pleno** da Lumi. O objetivo foi construir uma API que realiza o parse de faturas de energia elétrica, armazena os dados relevantes em um banco de dados PostgreSQL e os disponibiliza para uma aplicação web.

**Nota**: O trabalho submetido para este teste não será utilizado para fins comerciais ou integrado aos produtos da Lumi. Seu propósito é exclusivamente avaliativo.

## Tecnologias Utilizadas

- **Back-end**: Node.js (Express)
- **Banco de Dados**: PostgreSQL
- **ORM**: Sequelize
- **API**: Construída com Express e TypeScript
- **Ferramentas**: Dotenv, Supabase para armazenamento de arquivos

## Funcionalidades

1. **API RESTful**: Recebe requisições HTTP, faz o parse de faturas e retorna informações organizadas.
2. **Banco de Dados**: Armazenamento dos dados das faturas no PostgreSQL.
3. **Configuração com variáveis de ambiente**: Facilita a configuração de dados sensíveis.
4. **Deploy no Heroku**: API disponível para acesso público.

## Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/Robetjunior/Lumi-sChallenge.git
cd Lumi-sChallenge/backend
```

### 2. Instalar Dependências
```bash
npm install
```

3. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do diretório do backend com as seguintes variáveis:
```bash
DB_USERNAME=postgres.yhivluwnxpbqwntxnmtn
DB_PASSWORD=TMYTJopWtIBWRuDb
DB_DATABASE=postgres
DB_HOST=aws-0-us-west-1.pooler.supabase.com
DB_PORT=6543
DB_DIALECT=postgres
```

Essas variáveis são necessárias para a conexão com o banco de dados PostgreSQL.

### 4. Executar o Servidor de Desenvolvimento
Para iniciar o servidor backend, execute:
```bash
npm run dev
```

A API estará disponível em http://localhost:3001.

### 5. Testar a API
Para verificar se a API está funcionando corretamente, faça uma requisição GET:
```bash
curl http://localhost:3001/api/invoices
```

### Endpoints da API
GET /api/invoices
Retorna todas as faturas armazenadas no banco de dados.

POST /api/invoices
Adiciona uma nova fatura ao banco de dados a partir de um arquivo PDF.

GET /api/invoices/:id
Retorna informações detalhadas de uma fatura específica.

### Deploy
A API está hospedada no Heroku e pode ser acessada através do link abaixo:

[Executar o projeto](https://lumi-front-82af2d71e234.herokuapp.com/)

### Estrutura do Projeto
```bash
backend/
├── src/                      # Código-fonte principal
│   ├── public/          
│   ├── controllers/          # Controladores de API
│   ├── services/             # Services de API
│   ├── models/               # Modelos Sequelize
│   ├── routes/               # Definição de rotas da API
│   └── utils/                # Lógica de serviço e de negócio
├── migrations/               # Arquivos de migração para o banco de dados
├── models/
├── config/
├── .env                      # Arquivo de variáveis de ambiente
├── package.json              # Gerenciamento de dependências e scripts
├── README.md                 # Documentação do projeto
└── tsconfig.json             # Configurações do TypeScript
```

### Testes
Para executar os testes do backend, utilize o seguinte comando:
```bash
npm test
```

Autor
José Roberto - [LinkedIn](https://www.linkedin.com/in/jos%C3%A9-roberto-dev/)
