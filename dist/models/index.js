"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const invoice_1 = require("./invoice"); // Função para inicializar o modelo de Invoice
// Carregar variáveis de ambiente do .env
dotenv_1.default.config();
// Configurar a conexão com o banco de dados usando as variáveis de ambiente
const dbConfig = {
    username: process.env.DB_USERNAME || 'postgres.yhivluwnxpbqwntxnmtn',
    password: process.env.DB_PASSWORD || 'TMYTJopWtIBWRuDb',
    database: process.env.DB_DATABASE || 'postgres',
    host: process.env.DB_HOST || 'aws-0-us-west-1.pooler.supabase.com',
    dialect: process.env.DB_DIALECT || 'postgres', // Converte para Dialect
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 6543,
};
// Inicializar a conexão Sequelize
exports.sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
});
// Inicializar os modelos
const Invoice = (0, invoice_1.initializeInvoiceModel)(exports.sequelize); // Usar a função para inicializar o modelo
// Exportar todos os modelos e a conexão Sequelize
const db = {
    sequelize: exports.sequelize,
    Sequelize: sequelize_1.Sequelize,
    Invoice,
};
exports.default = db;
