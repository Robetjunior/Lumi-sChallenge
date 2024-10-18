import { Router } from 'express';
import { Invoice } from '../../models/invoice';

const router = Router();

// Listar todas as faturas
router.get('/', async (req: any, res: any) => {
  try {
    const invoices = await Invoice.findAll();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
});


// Inserir uma nova fatura
router.post('/', async (req:any, res:any) => {
  try {
    const newInvoice = await Invoice.create(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao inserir fatura' });
  }
});

// Atualizar uma fatura (opcional)
router.put('/:id', async (req:any, res:any) => {
  const { id } = req.params;
  try {
    const updatedInvoice = await Invoice.update(req.body, { where: { id: Number(id) } });
    if (updatedInvoice[0] === 0) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }
    res.json({ message: 'Fatura atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fatura' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    // Buscar a fatura com base no ID informado
    const invoice = await Invoice.findOne({ where: { id: Number(id) } });

    // Verifica se encontrou a fatura
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Faturaaa não encontrada' });
    }
  } catch (error) {
    // Trata erros de conexão ou consulta ao banco
    res.status(500).json({ error: 'Erro ao buscar fatura' });
  }
});

router.get('/:no_cliente/:mes_referencia', async (req, res) => {
  const { no_cliente, mes_referencia } = req.params;
  try {
    const invoice = await Invoice.findOne({ where: { no_cliente, mes_referencia } });
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Fatura não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fatura' });
  }
});

// Excluir uma fatura (opcional)
router.delete('/:id', async (req:any, res:any) => {
  console.log('teste')
  const { id } = req.params;
  try {
    const deletedInvoice = await Invoice.destroy({ where: { id: Number(id) } });
    if (!deletedInvoice) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir fatura' });
  }
});

// Cálculo de Consumo de Energia Elétrica (kWh) e Valor Total sem GD (R$)
router.get('/calculos/:no_cliente/:mes_referencia', async (req:any, res:any) => {
  const { no_cliente, mes_referencia } = req.params;
  try {
    const invoice = await Invoice.findOne({ where: { no_cliente, mes_referencia } });
    if (invoice) {
      const consumoTotal = (invoice.energia_eletrica_kwh || 0) + (invoice.energia_sceee_kwh || 0);
      const valorTotalSemGD = (invoice.energia_eletrica_valor || 0) + (invoice.energia_sceee_valor || 0) + (invoice.contrib_ilum_publica || 0);
      res.json({ consumoTotal, valorTotalSemGD });
    } else {
      res.status(404).json({ error: 'Fatura não encontrada para cálculo' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular variáveis' });
  }
});

export default router;
