import { Invoice } from '../models/invoice'; // Modelo do banco de dados
import { Op } from 'sequelize';

export const InvoiceService = {
  getAllInvoices: async () => {
    return await Invoice.findAll();
  },

  getDashboardData: async (year: string) => {
    console.log(`Iniciando getDashboardData para o ano: ${year}`);

    // Busca todas as faturas do ano informado
    const invoices = await Invoice.findAll({
      where: {
        mes_referencia: { [Op.like]: `%${year}%` }
      }
    });

    console.log(`Número de faturas encontradas: ${invoices.length}`);

    if (!invoices || invoices.length < 2) {
      console.error('Faturas insuficientes para comparação.');
      return null;
    }

    // Mapeamento para converter abreviações de mês para números
    const monthMapping: { [key: string]: number } = {
      JAN: 1, FEV: 2, MAR: 3, ABR: 4, MAI: 5, JUN: 6,
      JUL: 7, AGO: 8, SET: 9, OUT: 10, NOV: 11, DEZ: 12,
    };

    // Ordena as faturas pela data
    const sortedInvoices = invoices.sort((a, b) => {
      const [monthA, yearA] = a.mes_referencia.split('/');
      const [monthB, yearB] = b.mes_referencia.split('/');
      // Se o mês estiver em formato de abreviação, usa o mapping; caso contrário tenta converter diretamente
      const monthA_num = monthMapping[monthA.toUpperCase()] || Number(monthA);
      const monthB_num = monthMapping[monthB.toUpperCase()] || Number(monthB);
      return new Date(Number(yearA), monthA_num - 1).getTime() -
             new Date(Number(yearB), monthB_num - 1).getTime();
    });

    console.log('Fatura mais antiga:', sortedInvoices[0].mes_referencia);
    console.log('Fatura mais recente:', sortedInvoices[sortedInvoices.length - 1].mes_referencia);

    const currentInvoice = sortedInvoices[sortedInvoices.length - 1];
    const previousInvoice = sortedInvoices[sortedInvoices.length - 2];

    // Dados para os cards do dashboard
    const cardData = {
      energiaGerada: currentInvoice.energia_eletrica_kwh || 0,
      energiaConsumida: currentInvoice.energia_sceee_kwh || 0,
      energiaCompensada: currentInvoice.energia_compensada_kwh || 0,
      saldoCreditos: Math.abs(currentInvoice.energia_compensada_valor || 0),
      previousValues: {
        energiaGerada: previousInvoice.energia_eletrica_kwh || 0,
        energiaConsumida: previousInvoice.energia_sceee_kwh || 0,
        energiaCompensada: previousInvoice.energia_compensada_kwh || 0,
        saldoCreditos: Math.abs(previousInvoice.energia_compensada_valor || 0)
      }
    };

    console.log('Dados dos cards:', cardData);

    // Agrupamento por mês para gráficos ou relatórios
    const groups: { [key: string]: any } = {};

    sortedInvoices.forEach(invoice => {
      const parts = invoice.mes_referencia.split('/');
      if (parts.length < 2) {
        console.error(`Formato inválido de mes_referencia na fatura ID ${invoice.id}: ${invoice.mes_referencia}`);
        return;
      }
      const [month, invoiceYear] = parts;
      if (invoiceYear === year) {
        const key = `${invoiceYear}-${month}`;
        if (!groups[key]) {
          groups[key] = { name: key, totalKwh: 0, totalCompensada: 0, totalFinance: 0, totalEconomia: 0 };
        }
        groups[key].totalKwh += (invoice.energia_eletrica_kwh || 0) + (invoice.energia_sceee_kwh || 0);
        groups[key].totalCompensada += invoice.energia_compensada_kwh || 0;
        
        // Converte os valores financeiros para número antes de somar
        const elecValor = parseFloat(invoice.energia_eletrica_valor as any) || 0;
        const sceeValor = parseFloat(invoice.energia_sceee_valor as any) || 0;
        const contrib = parseFloat(invoice.contrib_ilum_publica as any) || 0;
        groups[key].totalFinance += elecValor + sceeValor + contrib;

        const economiaGD = parseFloat(invoice.energia_compensada_valor as any) || 0;
        groups[key].totalEconomia += Math.abs(economiaGD);
      }
    });

    // Converte o objeto agrupado em array e ordena pelos meses
    const groupedData = Object.values(groups).sort((a: any, b: any) => {
      const monthA = a.name.split('-')[1];
      const monthB = b.name.split('-')[1];
      const monthA_num = monthMapping[monthA.toUpperCase()] || Number(monthA);
      const monthB_num = monthMapping[monthB.toUpperCase()] || Number(monthB);
      return monthA_num - monthB_num;
    });

    console.log('Dados agrupados:', groupedData);

    return { cardData, groupedData };
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
