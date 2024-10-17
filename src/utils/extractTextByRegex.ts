// Função auxiliar para extrair texto com base em uma expressão regular
export const extractTextByRegex = (text: string, regex: RegExp): string | null => {
    const match = text.match(regex);
    return match ? match[1] : null; // Retorna o primeiro grupo de captura
  };
  
  // Função auxiliar para extrair números e converter para float, substituindo vírgulas por pontos
  export const extractNumberByRegex = (text: string, regex: RegExp): number | null => {
    const match = text.match(regex);
    if (match) {
      // Remove qualquer vírgula e converte para número
      const number = parseFloat(match[1].replace(',', '.'));
      return isNaN(number) ? null : number;
    }
    return null;
  };