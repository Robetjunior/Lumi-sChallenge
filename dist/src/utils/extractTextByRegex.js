"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNumberByRegex = exports.extractTextByRegex = void 0;
// Função auxiliar para extrair texto com base em uma expressão regular
const extractTextByRegex = (text, regex) => {
    const match = text.match(regex);
    return match ? match[1] : null; // Retorna o primeiro grupo de captura
};
exports.extractTextByRegex = extractTextByRegex;
// Função auxiliar para extrair números e converter para float, substituindo vírgulas por pontos
const extractNumberByRegex = (text, regex) => {
    const match = text.match(regex);
    if (match) {
        // Remove qualquer vírgula e converte para número
        const number = parseFloat(match[1].replace(',', '.'));
        return isNaN(number) ? null : number;
    }
    return null;
};
exports.extractNumberByRegex = extractNumberByRegex;
