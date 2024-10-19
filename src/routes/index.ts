import express from 'express';
import { Invoice } from '../../models/invoice';
const router = express.Router();
import { Request, Response } from 'express';


// Rota para salvar os dados extraídos
router.post('/invoices', async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;
    const newInvoice = await Invoice.create(invoiceData);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar a fatura' });
  }
});

// Rota para listar as faturas
router.get('/invoices', async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
});

export default router;
