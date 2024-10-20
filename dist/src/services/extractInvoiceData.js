"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractInvoiceData = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const extractInvoiceData = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const dataBuffer = fs_1.default.readFileSync(filePath);
    const data = yield (0, pdf_parse_1.default)(dataBuffer);
    const text = data.text;
    console.log('Texto extraído do PDF:', text); // Para depuração
    const invoiceData = {
        no_cliente: extractField(text, /Nº DO CLIENTE.*\n\s+(\d+)/),
        mes_referencia: extractField(text, /Referente a.*\n\s+([A-Z]{3}\/\d{4})/),
        energia_eletrica_kwh: parseFloat(extractField(text, /Energia ElétricakWh\s+(\d+)/) || '0'),
        energia_eletrica_valor: parseFloat(((_a = extractField(text, /Energia ElétricakWh\s+\d+\s+[\d,]+\s+([\d,]+)/)) === null || _a === void 0 ? void 0 : _a.replace('.', '').replace(',', '.')) || '0'),
        energia_sceee_kwh: parseFloat(extractField(text, /Energia SCEE s\/ ICMSkWh\s+(\d+)/) || '0'),
        energia_sceee_valor: parseFloat(((_b = extractField(text, /Energia SCEE s\/ ICMSkWh\s+\d+\s+[\d,]+\s+([\d,]+)/)) === null || _b === void 0 ? void 0 : _b.replace('.', '').replace(',', '.')) || '0'),
        energia_compensada_kwh: parseFloat(extractField(text, /Energia compensada GD IkWh\s+(\d+)/) || '0'),
        energia_compensada_valor: parseFloat(((_c = extractField(text, /Energia compensada GD IkWh\s+\d+\s+[\d,]+\s+(-?[\d,]+)/)) === null || _c === void 0 ? void 0 : _c.replace('.', '').replace(',', '.')) || '0'),
        contrib_ilum_publica: parseFloat(((_d = extractField(text, /Contrib Ilum Publica Municipal\s+([\d,]+)/)) === null || _d === void 0 ? void 0 : _d.replace('.', '').replace(',', '.')) || '0'),
        valor_total: parseFloat(((_e = extractField(text, /Total\s+a\s+pagar.*\n.*R\$\s*([\d.,]+)/)) === null || _e === void 0 ? void 0 : _e.replace('.', '').replace(',', '.')) || '0'),
        nome_uc: ((_g = (_f = extractField(text, /(?:\d+\s+)?([\w\s]+)\n.*(?:RUA|AV|AVENIDA|ESTRADA|ALAMEDA|TRAVESSA|RODOVIA|PRAÇA|VIA)/i)) === null || _f === void 0 ? void 0 : _f.split('\n').pop()) === null || _g === void 0 ? void 0 : _g.trim()) || 'Desconhecido',
        distribuidora: ((_j = (_h = extractField(text, /(?:.*?\n)?([A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s\.]+DISTRIBUIÇÃO\sS\.A\.)/)) === null || _h === void 0 ? void 0 : _h.split('\n').pop()) === null || _j === void 0 ? void 0 : _j.trim()) || 'Desconhecida',
    };
    return invoiceData;
});
exports.extractInvoiceData = extractInvoiceData;
// Função auxiliar para extrair campos do texto usando regex
const extractField = (text, regex) => {
    const match = text.match(regex);
    return match ? match[1] : null;
};
