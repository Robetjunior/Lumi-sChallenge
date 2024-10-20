import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'; // Importar CORS
import dotenv from 'dotenv';
import { sequelize } from './models';
import invoiceRoutes from './src/routes/invoice';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Opções do CORS para permitir tudo o que o front pode precisar
const corsOptions = {
  origin: ['https://lumi-front-82af2d71e234.herokuapp.com'], // Adicione mais origens aqui se necessário
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Permitir todos os métodos HTTP
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'], // Permitir cabeçalhos mais comuns
  credentials: true, // Permitir o uso de credenciais (cookies, tokens de autenticação)
  preflightContinue: false, // Preflight não precisa de resposta personalizada
  optionsSuccessStatus: 204, // Para evitar problemas com o status em alguns navegadores
};

// Aplicar CORS globalmente com as opções configuradas
app.use(cors(corsOptions));

// Tratativa adicional para requisições OPTIONS
app.options('*', cors(corsOptions));

// Parsing de JSON e URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/api/invoices', invoiceRoutes);

// Conexão com banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida!');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
