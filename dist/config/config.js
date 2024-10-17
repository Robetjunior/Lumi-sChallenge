"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carregar variáveis de ambiente do arquivo .env
module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'postgres.yhivluwnxpbqwntxnmtn',
        password: process.env.DB_PASSWORD || 'TMYTJopWtIBWRuDb',
        database: process.env.DB_DATABASE || 'postgres',
        host: process.env.DB_HOST || 'aws-0-us-west-1.pooler.supabase.com',
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 6543,
    },
    test: {
        username: process.env.DB_USERNAME || 'postgres.yhivluwnxpbqwntxnmtn',
        password: process.env.DB_PASSWORD || 'TMYTJopWtIBWRuDb',
        database: process.env.DB_DATABASE || 'postgres',
        host: process.env.DB_HOST || 'aws-0-us-west-1.pooler.supabase.com',
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 6543,
    },
    production: {
        username: process.env.DB_USERNAME || 'postgres.yhivluwnxpbqwntxnmtn',
        password: process.env.DB_PASSWORD || 'TMYTJopWtIBWRuDb',
        database: process.env.DB_DATABASE || 'postgres',
        host: process.env.DB_HOST || 'aws-0-us-west-1.pooler.supabase.com',
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 6543,
    },
};
