import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';
import { initializeInvoiceModel } from './invoice'; // Função para inicializar o modelo de Invoice

// Carregar variáveis de ambiente do .env
dotenv.config();

// Configurar a conexão com o banco de dados usando as variáveis de ambiente
const dbConfig = {
  username: process.env.DB_USERNAME || 'postgres.yhivluwnxpbqwntxnmtn',
  password: process.env.DB_PASSWORD || 'TMYTJopWtIBWRuDb',
  database: process.env.DB_DATABASE || 'postgres',
  host: process.env.DB_HOST || 'aws-0-us-west-1.pooler.supabase.com',
  dialect: (process.env.DB_DIALECT as Dialect) || 'postgres', // Converte para Dialect
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 6543,
};

// Inicializar a conexão Sequelize
export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
  }
);

// Inicializar os modelos
const Invoice = initializeInvoiceModel(sequelize); // Usar a função para inicializar o modelo

// Exportar todos os modelos e a conexão Sequelize
const db = {
  sequelize,
  Sequelize,
  Invoice,
};

export default db;
