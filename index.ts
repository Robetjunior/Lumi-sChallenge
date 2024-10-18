import express from 'express';
import cors from 'cors'; // Importar CORS
import dotenv from 'dotenv';
import { sequelize } from './models';
import invoiceRoutes from './src/routes/invoice';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Habilitar CORS para todas as origens
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/invoices', invoiceRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida!');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
