import { extractInvoiceData } from './extractInvoiceData';
import fs from 'fs';

describe('Extração de Dados da Fatura', () => {
  it('Deve extrair corretamente os dados da fatura', async () => {
    // Carregar o PDF de exemplo
    const filePath = 'C:/Users/Samsung/Desktop/Teste_Tecnico_Lumi/lumi-energy-bills/src/public/3001116735-01-2024.pdf';

    // Dados esperados da fatura
    const expectedData = {
      no_cliente: '7204076116',
      mes_referencia: 'JAN/2024',
      energia_eletrica_kwh: 50,
      energia_eletrica_valor: 47.75,
      energia_sceee_kwh: 456,
      energia_sceee_valor: 232.42,
      energia_compensada_kwh: 456,
      energia_compensada_valor: -222.22,
      contrib_ilum_publica: 49.43,
      valor_total: 0,
    };

    // Chamar a função de extração
    const invoiceData = await extractInvoiceData(filePath);
    console.log(invoiceData)
    // Validar os dados extraídos
    expect(invoiceData).toEqual(expectedData);
  });
});
