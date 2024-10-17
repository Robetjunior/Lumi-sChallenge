import { Router } from 'express';
import { Invoice } from '../../models/invoice'; 

const router = Router();

// Rota para salvar os dados extraídos
router.post('/', async (req, res) => {
  try {
    const invoiceData = req.body;
    console.log('Dados recebidos no POST:', invoiceData); // Log dos dados recebidos
    const newInvoice = await Invoice.create(invoiceData);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar a fatura' });
  }
});

// Rota para listar as faturas
router.get('/invoices', async (req, res) => {
  try {
    console.log('teste')
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
});

export default router;
