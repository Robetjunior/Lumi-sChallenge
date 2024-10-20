import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoiceService'; // Importa o serviço correspondente
import fs from 'fs';
import { supabase } from '../../config/supabase'; // Configuração do Supabase
import multer from 'multer';
import { extractInvoiceData } from '../services/extractInvoiceData';

// Configuração do multer para receber arquivos PDF
const upload = multer({ dest: 'uploads/' }); // Os arquivos serão armazenados na pasta 'uploads'

// Listar todas as faturas
export const listInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await InvoiceService.getAllInvoices();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
};

export const searchInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { distributor, consumer, year } = req.query;
    const invoices = await InvoiceService.searchInvoices(distributor as string, consumer as string, year as string);
    if (invoices.length === 0) {
      res.status(404).json({ error: 'Nenhuma fatura encontrada' });
    } else {
      res.json(invoices);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
};

// Inserir uma nova fatura
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'Nenhum arquivo enviado' });
    return;
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const bucketName = 'faturas'; 

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo PDF não encontrado no caminho fornecido.');
    }

    const invoiceData = await extractInvoiceData(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`faturas/${fileName}.pdf`, fileBuffer, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw new Error(`Erro ao enviar o arquivo para o Supabase: ${uploadError.message}`);
    }

    const fileUrl = `https://yhivluwnxpbqwntxnmtn.supabase.co/storage/v1/object/public/faturas/${fileName}`;

    const sanitizedInvoiceData = InvoiceService.sanitizeInvoiceData(invoiceData, fileUrl);
    const newInvoice = await InvoiceService.createInvoice(sanitizedInvoiceData);

    fs.unlink(filePath, (err) => { 
      if (err) {
        console.error(`Erro ao remover o arquivo: ${filePath}`, err);
      }
    });

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Erro ao processar a fatura PDF:', error);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Erro ao remover o arquivo após falha: ${filePath}`, err);
      }
    });

    res.status(500).json({ error: 'Erro ao processar o arquivo PDF e salvar a fatura' });
  }
};

// Buscar uma fatura por ID
export const getInvoiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const invoice = await InvoiceService.getInvoiceById(Number(id));
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Fatura não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fatura' });
  }
};

// Atualizar uma fatura
export const updateInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedInvoice = await InvoiceService.updateInvoice(Number(id), req.body);
    if (!updatedInvoice) {
      res.status(404).json({ error: 'Fatura não encontrada' });
    } else {
      res.json({ message: 'Fatura atualizada com sucesso' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fatura' });
  }
};

// Excluir uma fatura
export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedInvoice = await InvoiceService.deleteInvoice(Number(id));
    if (!deletedInvoice) {
      res.status(404).json({ error: 'Fatura não encontrada' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir fatura' });
  }
};

// Cálculo de Consumo de Energia Elétrica e Valor Total sem GD
export const calculateEnergyUsage = async (req: Request, res: Response) => {
  const { no_cliente, mes_referencia } = req.params;
  try {
    const calculationResult = await InvoiceService.calculateEnergyUsage(no_cliente, mes_referencia);
    if (calculationResult) {
      res.json(calculationResult);
    } else {
      res.status(404).json({ error: 'Fatura não encontrada para cálculo' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular variáveis' });
  }
};
