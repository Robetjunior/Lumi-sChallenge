"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const invoice_1 = __importDefault(require("./invoice")); // Importar o modelo Invoice corretamente
// Carregar variáveis de ambiente do .env
dotenv_1.default.config();
// Configurar a conexão com o banco de dados usando as variáveis de ambiente
const dbConfig = {
    username: process.env.DB_USERNAME || 'seu_usuario',
    password: process.env.DB_PASSWORD || 'sua_senha',
    database: process.env.DB_DATABASE || 'lumi_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
};
// Inicializar a conexão Sequelize
exports.sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
});
// Inicializar os modelos
const Invoice = (0, invoice_1.default)(exports.sequelize);
// Exportar todos os modelos e a conexão Sequelize
const db = {
    sequelize: exports.sequelize,
    Sequelize: sequelize_1.Sequelize,
    Invoice,
};
exports.default = db;
