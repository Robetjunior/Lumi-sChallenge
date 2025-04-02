import fs from 'fs';
import pdfParse from 'pdf-parse';
import { parseNumber } from '../utils/parseNumber';

interface InvoiceData {
  no_cliente: string | null;
  mes_referencia: string | null;
  energia_eletrica_kwh: number | null;
  energia_eletrica_valor: number | null;
  energia_sceee_kwh: number | null;
  energia_sceee_valor: number | null;
  energia_compensada_kwh: number | null;
  energia_compensada_valor: number | null;
  contrib_ilum_publica: number | null;
  valor_total: number | null;
  nome_uc: string | null;
  distribuidora: string | null;
}

export const extractInvoiceData = async (filePath: string): Promise<InvoiceData> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const text = data.text;

  const invoiceData: InvoiceData = {
    no_cliente: extractField(text, /Nº DO CLIENTE.*\n\s+(\d+)/),
    mes_referencia: extractField(text, /Referente a.*\n\s+([A-Z]{3}\/\d{4})/),
    energia_eletrica_kwh: parseNumber(extractField(text, /Energia ElétricakWh\s+([\d\.,]+)/) || '0'),
    energia_eletrica_valor: parseNumber(extractField(text, /Energia ElétricakWh\s+[\d\.,]+\s+[\d,]+\s+([\d,]+)/) || '0'),
    energia_sceee_kwh: parseNumber(extractField(text, /Energia SCEE s\/ ICMSkWh\s+([\d\.,]+)/) || '0'),
    energia_sceee_valor: parseNumber(extractField(text, /Energia SCEE s\/ ICMSkWh\s+[\d\.,]+\s+[\d,]+\s+([\d,]+)/) || '0'),
    energia_compensada_kwh: parseNumber(extractField(text, /Energia compensada GD IkWh\s+([\d\.,]+)/) || '0'),
    energia_compensada_valor: parseNumber(extractField(text, /Energia compensada GD IkWh\s+[\d\.,]+\s+[\d,]+\s+(-?[\d,]+)/) || '0'),
    contrib_ilum_publica: parseNumber(extractField(text, /Contrib Ilum Publica Municipal\s+([\d,]+)/) || '0'),
    valor_total: parseNumber(extractField(text, /Total\s+a\s+pagar.*\n.*R\$\s*([\d\.,]+)/) || '0'),
    nome_uc: extractField(text, /(?:\d+\s+)?([\w\s]+)\n.*(?:RUA|AV|AVENIDA|ESTRADA|ALAMEDA|TRAVESSA|RODOVIA|PRAÇA|VIA)/i)
      ?.split('\n')
      .pop()
      ?.trim() || 'Desconhecido',
    distribuidora: extractField(text, /(?:.*?\n)?([A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s\.]+DISTRIBUIÇÃO\sS\.A\.)/)
      ?.split('\n')
      .pop()
      ?.trim() || 'Desconhecida',
  };

  return invoiceData;
};

// Função auxiliar para extrair campos do texto usando expressão regular
const extractField = (text: string, regex: RegExp): string | null => {
  const match = text.match(regex);
  return match ? match[1] : null;
};
