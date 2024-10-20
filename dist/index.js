"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Importar CORS
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
const invoice_1 = __importDefault(require("./src/routes/invoice"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: '*', // Permitir especificamente a origem do seu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/invoices', invoice_1.default);
models_1.sequelize.authenticate()
    .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida!');
})
    .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
