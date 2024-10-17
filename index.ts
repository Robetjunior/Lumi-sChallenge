import express from 'express';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';
import { sequelize } from './models'; // Importa o Sequelize da pasta models
import invoiceRoutes from './src/routes/invoice'; // Rotas de faturas
import { extractInvoiceData } from './src/services/extractInvoiceData'; // Função de extração
import { Invoice } from './models/invoice'; // Certifique-se de importar o modelo correto
import bodyParser from 'body-parser';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para lidar com JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas da aplicação
app.use('/api/invoices', invoiceRoutes);

// Testar a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida!');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

// Função de teste para extrair dados do PDF e salvar no banco
const testPDFExtraction = async () => {
  try {
    const filePath = 'C:/Users/Samsung/Desktop/Teste_Tecnico_Lumi/lumi-energy-bills/src/public/3001116735-01-2024.pdf';
    
    const invoiceData = await extractInvoiceData(filePath);  // Extrair dados
    console.log('Dados extraídos da fatura:', invoiceData);
    
    // Salvar os dados extraídos no banco
    const newInvoice = await Invoice.create(invoiceData);
    console.log('Fatura salva no banco de dados:', newInvoice);

  } catch (error) {
    console.error('Erro ao processar o PDF e salvar no banco:', error);
  }
};

// Chamar a função de extração de dados para teste
testPDFExtraction();

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
