import { Invoice } from '../../models/invoice'; // Modelo do banco de dados
import { Op } from 'sequelize';

// Função para buscar todas as faturas
export const InvoiceService = {
  getAllInvoices: async () => {
    return await Invoice.findAll();
  },

  searchInvoices: async (distributor: string, consumer: string, year: string) => {
    const whereClause: any = {};

    if (distributor && distributor !== '') {
      whereClause.distributor = distributor;
    }

    if (consumer && consumer !== '') {
      whereClause.nome_uc = { [Op.like]: `%${consumer}%` };
    }

    if (year && year !== '') {
      whereClause.mes_referencia = { [Op.like]: `%${year}%` };
    }

    return await Invoice.findAll({ where: whereClause });
  },

  // Função para criar uma nova fatura no banco de dados
  createInvoice: async (data: any) => {
    return await Invoice.create(data);
  },

  // Função para buscar uma fatura por ID
  getInvoiceById: async (id: number) => {
    return await Invoice.findOne({ where: { id } });
  },

  // Função para atualizar uma fatura existente
  updateInvoice: async (id: number, data: any) => {
    const [updatedRows] = await Invoice.update(data, { where: { id } });
    return updatedRows > 0;
  },

  // Função para excluir uma fatura
  deleteInvoice: async (id: number) => {
    const deletedRows = await Invoice.destroy({ where: { id } });
    return deletedRows > 0;
  },

  // Função para calcular o consumo de energia e valor total sem GD
  calculateEnergyUsage: async (no_cliente: string, mes_referencia: string) => {
    const invoice = await Invoice.findOne({ where: { no_cliente, mes_referencia } });
    if (invoice) {
      const consumoTotal = (invoice.energia_eletrica_kwh || 0) + (invoice.energia_sceee_kwh || 0);
      const valorTotalSemGD = (invoice.energia_eletrica_valor || 0) + (invoice.energia_sceee_valor || 0) + (invoice.contrib_ilum_publica || 0);
      return { consumoTotal, valorTotalSemGD };
    }
    return null;
  },

  // Sanitizar dados da fatura
  sanitizeInvoiceData: (invoiceData: any, fileUrl: string) => ({
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
  })

  
};
