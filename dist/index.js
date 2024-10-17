"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models"); // Importa o sequelize da pasta models
const routes_1 = __importDefault(require("./src/routes")); // Importa as rotas
// Carregar as variáveis de ambiente do arquivo .env
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use(express_1.default.json());
// Definir as rotas
app.use('/api', routes_1.default);
// Testar a conexão com o banco de dados
models_1.sequelize.authenticate()
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
