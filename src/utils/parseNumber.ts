export const parseNumber = (numStr: string): number => {
    // Remove separadores de milhar (pontos) e substitui vírgula decimal por ponto.
    const normalized = numStr.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized);
  };
  