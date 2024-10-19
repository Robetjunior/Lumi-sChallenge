import { Router, Request, Response } from 'express';
import { supabase } from '../../config/supabase'
import fs from 'fs';
import { extractInvoiceData } from '../services/extractInvoiceData'; // Função para extração de dados do PDF
import { Invoice } from '../../models/invoice'; // Seu modelo de banco de dados
import { Op } from 'sequelize';
import multer from 'multer';


// Configuração do multer para receber arquivos PDF
const upload = multer({ dest: 'uploads/' }); // Os arquivos enviados serão armazenados na pasta 'uploads'

const router = Router();
// Listar todas as faturas
router.get('/', async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.findAll();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
});


// Inserir uma nova fatura
router.post('/', upload.single('fatura_pdf'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'Nenhum arquivo enviado' });
    return;
  }

  const filePath = req.file.path; // Caminho temporário onde o arquivo foi salvo
  const fileName = req.file.filename; // Nome do arquivo
  const bucketName = 'faturas'; // Nome do bucket no Supabase

  try {
    // Verificar se o arquivo realmente existe
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo PDF não encontrado no caminho fornecido.');
    }

    // Extração dos dados da fatura a partir do arquivo PDF
    const invoiceData = await extractInvoiceData(filePath);

    // Ler o arquivo como um buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Realizar upload do arquivo PDF no Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`faturas/${fileName}.pdf`, fileBuffer, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw new Error(`Erro ao enviar o arquivo para o Supabase: ${uploadError.message}`);
    }

    const fileUrl = `https://yhivluwnxpbqwntxnmtn.supabase.co/storage/v1/object/public/faturas/${fileName}`; // URL completa do arquivo no bucket

    console.log(`Upload realizado com sucesso: ${uploadData.path}`);

    // Sanitizar dados: Garantir que os campos obrigatórios não tenham valor null
    const sanitizedInvoiceData = {
      no_cliente: invoiceData.no_cliente || '',
      mes_referencia: invoiceData.mes_referencia || '',
      energia_eletrica_kwh: invoiceData.energia_eletrica_kwh || 0,
      energia_eletrica_valor: invoiceData.energia_eletrica_valor || 0,
      energia_sceee_kwh: invoiceData.energia_sceee_kwh || 0,
      energia_sceee_valor: invoiceData.energia_sceee_valor || 0,
      energia_compensada_kwh: invoiceData.energia_compensada_kwh || 0,
      energia_compensada_valor: invoiceData.energia_compensada_valor || 0,
      contrib_ilum_publica: invoiceData.contrib_ilum_publica || 0,
      valor_total: invoiceData.valor_total || 0,
      nome_uc: invoiceData.nome_uc || '',
      distribuidora: invoiceData.distribuidora || '',
      pdf_url: fileUrl, 
    };

    // Salvar os dados extraídos no banco de dados
    const newInvoice = await Invoice.create(sanitizedInvoiceData);

    // Remover o arquivo PDF local após o upload
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

router.get('/search', async (req: Request, res: Response) => {
  console.log('entrou aqui?')
  const { distributor, consumer, year } = req.query;
  console.log(distributor, consumer, year)
  const whereClause: any = {};

  // Aplicar filtros se eles existirem
  if (distributor) {
    whereClause.distributor = distributor;
  }

  if (consumer) {
    whereClause.consumer = { [Op.like]: `%${consumer}%` }; 
  }

  if (year) {
    whereClause.mes_referencia = { [Op.like]: `%${year}%` }; 
  }

  try {
    const invoices = await Invoice.findAll({ where: whereClause });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
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

router.get('/:no_cliente/:mes_referencia', async (req: Request, res: Response) => {
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
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  console.log('teste')
  const { id } = req.params;
  try {
    const deletedInvoice = await Invoice.destroy({ where: { id: Number(id) } });
    if (!deletedInvoice) {
      res.status(404).json({ error: 'Fatura não encontrada' });
      return ;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir fatura' });
  }
});

// Cálculo de Consumo de Energia Elétrica (kWh) e Valor Total sem GD (R$)
router.get('/calculos/:no_cliente/:mes_referencia', async (req: Request, res: Response) => {
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
