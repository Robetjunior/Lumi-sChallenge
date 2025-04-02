import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { extractInvoiceData } from '../services/extractInvoiceData';
import { InvoiceService } from '../services/invoiceService';
import { supabase } from '../config/supabase';

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

    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`faturas/${fileName}.pdf`, fileBuffer, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw new Error(`Erro ao enviar o arquivo para o Supabase: ${uploadError.message}`);
    }

    const fileUrl = `https://atvtfhsozmrogcxvnecp.supabase.co/storage/v1/object/public/faturas/${fileName}`;

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

type UploadResult =
  | { file: string; status: 'ok'; invoice: any }
  | { file: string; status: 'error'; message: string };

/**
 * Função para processar vários arquivos PDF em uma pasta e criar as faturas correspondentes.
 */
export const uploadInvoicesFromFolder = async (req: Request, res: Response): Promise<void> => {
  console.log('Upload de faturas iniciado...');
  const folderPath = path.join(__dirname, '../faturas');

  try {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.pdf'));
    if (files.length === 0) {
      res.status(404).json({ message: 'Nenhum arquivo PDF encontrado na pasta.' });
      return;
    }

    const results: UploadResult[] = [];

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      try {
        // Verifica se o arquivo existe
        if (!fs.existsSync(filePath)) {
          throw new Error('Arquivo não encontrado.');
        }

        // Extrai os dados da fatura do PDF
        const invoiceData = await extractInvoiceData(filePath);

        // Lê o arquivo em Buffer
        const fileBuffer = fs.readFileSync(filePath);
        console.log(`Arquivo: ${file}, tamanho do buffer: ${fileBuffer.length}`);

        // // Faz o upload do PDF para o Supabase Storage na subpasta "faturas"
        // const { data: uploadData, error: uploadError } = await supabase.storage
        //   .from(bucketName)
        //   .upload(`${file}`, fileBuffer, {
        //     contentType: 'application/pdf',
        //   });

        // if (uploadError) {
        //   throw new Error(`Erro ao enviar o arquivo ${file}: ${uploadError.message}`);
        // }

        // Constrói a URL pública do arquivo
        const fileUrl = `https://atvtfhsozmrogcxvnecp.supabase.co/storage/v1/object/public/faturas/${file}`;

        // Opcional: se desejar, valide a URL antes de prosseguir
        // const isValid = await validateFileUrl(fileUrl);
        // if (!isValid) {
        //   throw new Error(`O arquivo não foi encontrado na URL: ${fileUrl}`);
        // }

        // Sanitiza os dados da fatura, incluindo a URL do PDF
        const sanitizedInvoiceData = InvoiceService.sanitizeInvoiceData(invoiceData, fileUrl);

        // Cria a fatura no banco de dados
        const newInvoice = await InvoiceService.createInvoice(sanitizedInvoiceData);

        // Remove o arquivo local (opcional)
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Erro ao remover o arquivo: ${filePath}`, err);
          }
        });

        results.push({ file, status: 'ok', invoice: newInvoice });
      } catch (err: any) {
        console.error(`Erro ao processar ${file}:`, err.message);
        results.push({ file, status: 'error', message: err.message || 'Erro desconhecido' });
      }
    }

    res.status(201).json({ message: 'Upload concluído.', results });
  } catch (err) {
    console.error('Erro geral ao processar os arquivos:', err);
    res.status(500).json({ error: 'Erro ao processar os arquivos da pasta.' });
  }
};