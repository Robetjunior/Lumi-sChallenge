// src/controllers/invoiceController.ts
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { extractInvoiceData } from '../services/extractInvoiceData';
import { InvoiceService } from '../services/invoiceService';
import { supabase } from '../config/supabase';

export const listInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await InvoiceService.getAllInvoices();
    res.json(invoices);
  } catch (error) {
    console.error('Erro em listInvoices:', error);
    next(error);
  }
};

export const searchInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { distributor, consumer, year } = req.query;
    const invoices = await InvoiceService.searchInvoices(distributor as string, consumer as string, year as string);
    if (invoices.length === 0) {
      res.status(404).json({ error: 'Nenhuma fatura encontrada' });
    } else {
      res.json(invoices);
    }
  } catch (error) {
    console.error('Erro em searchInvoices:', error);
    next(error);
  }
};

export const createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`faturas/${fileName}.pdf`, fileBuffer, { contentType: 'application/pdf' });

    if (uploadError) {
      throw new Error(`Erro ao enviar o arquivo para o Supabase: ${uploadError.message}`);
    }

    const fileUrl = `https://atvtfhsozmrogcxvnecp.supabase.co/storage/v1/object/public/faturas/${fileName}`;
    const sanitizedInvoiceData = InvoiceService.sanitizeInvoiceData(invoiceData, fileUrl);
    const newInvoice = await InvoiceService.createInvoice(sanitizedInvoiceData);

    fs.unlink(filePath, (err) => {
      if (err) console.error(`Erro ao remover o arquivo: ${filePath}`, err);
    });

    res.status(201).json(newInvoice);
    return;
  } catch (error) {
    console.error('Erro em createInvoice:', error);
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Erro ao remover o arquivo após falha: ${filePath}`, err);
    });
    next(error);
  }
};

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const invoice = await InvoiceService.getInvoiceById(Number(id));
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Fatura não encontrada' });
    }
  } catch (error) {
    console.error('Erro em getInvoiceById:', error);
    next(error);
  }
};

export const updateInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const updatedInvoice = await InvoiceService.updateInvoice(Number(id), req.body);
    if (!updatedInvoice) {
      res.status(404).json({ error: 'Fatura não encontrada' });
    } else {
      res.json({ message: 'Fatura atualizada com sucesso' });
    }
  } catch (error) {
    console.error('Erro em updateInvoice:', error);
    next(error);
  }
};

export const deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedInvoice = await InvoiceService.deleteInvoice(Number(id));
    if (!deletedInvoice) {
      res.status(404).json({ error: 'Fatura não encontrada' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Erro em deleteInvoice:', error);
    next(error);
  }
};

export const calculateEnergyUsage = async (req: Request, res: Response, next: NextFunction) => {
  const { no_cliente, mes_referencia } = req.params;
  try {
    const calculationResult = await InvoiceService.calculateEnergyUsage(no_cliente, mes_referencia);
    if (calculationResult) {
      res.json(calculationResult);
    } else {
      res.status(404).json({ error: 'Fatura não encontrada para cálculo' });
    }
  } catch (error) {
    console.error('Erro em calculateEnergyUsage:', error);
    next(error);
  }
};

export const uploadInvoicesFromFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const folderPath = path.join(__dirname, '../faturas');

  try {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.pdf'));
    if (files.length === 0) {
      res.status(404).json({ message: 'Nenhum arquivo PDF encontrado na pasta.' });
      return;
    }

    const results: Array<{ file: string; status: 'ok' | 'error'; invoice?: any; message?: string }> = [];
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      try {
        if (!fs.existsSync(filePath)) {
          throw new Error('Arquivo não encontrado.');
        }
        const invoiceData = await extractInvoiceData(filePath);
        const fileBuffer = fs.readFileSync(filePath);
        const fileUrl = `https://atvtfhsozmrogcxvnecp.supabase.co/storage/v1/object/public/faturas/${file}`;
        const sanitizedInvoiceData = InvoiceService.sanitizeInvoiceData(invoiceData, fileUrl);
        const newInvoice = await InvoiceService.createInvoice(sanitizedInvoiceData);
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Erro ao remover o arquivo: ${filePath}`, err);
        });
        results.push({ file, status: 'ok', invoice: newInvoice });
      } catch (err: any) {
        console.error(`Erro ao processar ${file}:`, err.message);
        results.push({ file, status: 'error', message: err.message || 'Erro desconhecido' });
      }
    }
    res.status(201).json({ message: 'Upload concluído.', results });
    return;
  } catch (err) {
    next(err);
  }
};

export const getDashboardData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { year } = req.query;
  if (!year) {
    res.status(400).json({ error: 'Ano não informado' });
    return;
  }
  try {
    const dashboardData = await InvoiceService.getDashboardData(year as string);
    if (dashboardData) {
      res.json(dashboardData);
      return;
    } else {
      res.status(404).json({ error: 'Nenhuma fatura encontrada para o ano informado' });
      return;
    }
  } catch (error) {
    console.error('Erro na rota getDashboardData:', error);
    next(error);
  }
};