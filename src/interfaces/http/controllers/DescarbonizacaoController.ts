import { Request, Response, NextFunction } from 'express';
import { calculadora } from '../../container';
import { TipoCombustivel } from '../../../domain/services/CalculadoraDescarbonizacao';

export class DescarbonizacaoController {
  calcular(req: Request, res: Response, next: NextFunction): void {
    try {
      const { cidadeOrigem, combustivel } = req.body;

      if (!cidadeOrigem || !combustivel) {
        res.status(400).json({ erro: 'cidadeOrigem e combustivel são obrigatórios' });
        return;
      }

      const combustivelUpper = (combustivel as string).toUpperCase() as TipoCombustivel;
      const validos: TipoCombustivel[] = ['GASOLINA', 'ALCOOL', 'DIESEL', 'ELETRICO'];
      if (!validos.includes(combustivelUpper)) {
        res.status(400).json({ erro: `Combustível inválido. Opções: ${validos.join(', ')}` });
        return;
      }

      const resultado = calculadora.calcular(cidadeOrigem, combustivelUpper);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }

  listarCidades(_req: Request, res: Response): void {
    res.json({ cidades: calculadora.listarCidades() });
  }
}
