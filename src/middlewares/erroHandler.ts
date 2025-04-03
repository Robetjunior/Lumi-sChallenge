import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Registra o erro com informações detalhadas
  logger.error('Erro: %s - %s', err.message, err.stack);
  
  // Retorna uma mensagem genérica para o cliente
  res.status(err.status || 500).json({
    error: 'Erro interno do servidor'
  });
};
