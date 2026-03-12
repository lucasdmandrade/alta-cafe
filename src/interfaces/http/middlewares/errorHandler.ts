import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors/DomainError';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof DomainError) {
    res.status(422).json({ erro: err.message, tipo: 'ERRO_DOMINIO' });
    return;
  }
  console.error('[ERRO]', err.message);
  res.status(500).json({ erro: 'Erro interno do servidor' });
}
