import { Router } from 'express';
import multer from 'multer';
import { extractInvoiceData } from '../services/extractInvoiceData'; // Certifique-se de ajustar o caminho conforme necessário
import { Invoice } from '../../models/invoice';
import fs from 'fs'; 

// Configuração do multer para receber arquivos PDF
const upload = multer({ dest: 'uploads/' }); // Os arquivos enviados serão armazenados na pasta 'uploads'

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
router.post('/', upload.single('fatura_pdf'), async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const filePath = req.file.path; // Caminho temporário onde o arquivo foi salvo
  try {
    // Extração dos dados da fatura a partir do arquivo PDF
    const invoiceData = await extractInvoiceData(filePath);

    // Sanitizar dados: Garantir que os campos obrigatórios não tenham valor null
    const sanitizedInvoiceData = {
      no_cliente: invoiceData.no_cliente || '', // Substitua null por string vazia
      mes_referencia: invoiceData.mes_referencia || '',
      energia_eletrica_kwh: invoiceData.energia_eletrica_kwh || 0,
      energia_eletrica_valor: invoiceData.energia_eletrica_valor || 0,
      energia_sceee_kwh: invoiceData.energia_sceee_kwh || 0,
      energia_sceee_valor: invoiceData.energia_sceee_valor || 0,
      energia_compensada_kwh: invoiceData.energia_compensada_kwh || 0,
      energia_compensada_valor: invoiceData.energia_compensada_valor || 0,
      contrib_ilum_publica: invoiceData.contrib_ilum_publica || 0,
      valor_total: invoiceData.valor_total || 0,
    };

    // Salvar os dados extraídos no banco de dados
    const newInvoice = await Invoice.create(sanitizedInvoiceData);

    // Remover o arquivo PDF após o processamento
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Erro ao remover o arquivo: ${filePath}`, err);
      } else {
        console.log(`Arquivo removido: ${filePath}`);
      }
    });

    // Enviar resposta de sucesso
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Erro ao processar a fatura PDF:', error);

    // Remover o arquivo em caso de erro
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Erro ao remover o arquivo após falha: ${filePath}`, err);
      }
    });

    res.status(500).json({ error: 'Erro ao processar o arquivo PDF e salvar a fatura' });
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

router.post('/', async (req: any, res: any) => {
  try {
    const newInvoice = await Invoice.create(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao inserir fatura' });
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
