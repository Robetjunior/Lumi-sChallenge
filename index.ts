import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './src/models';
import invoiceRoutes from './src/routes/invoice';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

dotenv.config();

export const validateFileUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url);
    return response.ok; 
  } catch (err) {
    console.error('Erro ao validar URL:', err);
    return false;
  }
};

// Wrapper para middleware async
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Bem-vindo Lumis-Challenge');
});

app.get('/test-url', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const url = req.query.url as string;
  if (!url) {
    res.status(400).json({ error: 'URL não informada' });
    return;
  }
  const isValid = await validateFileUrl(url);
  res.json({ url, valid: isValid });
}));

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
