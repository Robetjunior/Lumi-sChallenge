import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './models'; // Sequelize instance
import invoiceRoutes from './src/routes/invoice'; // Import routes
import bodyParser from 'body-parser';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas de faturas
app.use('/api/invoices', invoiceRoutes);

// Testar a conexão com o banco de dados
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
