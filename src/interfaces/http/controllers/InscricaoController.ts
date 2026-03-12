import { Request, Response, NextFunction } from 'express';
import { registrarCredenciadoUseCase } from '../../container';

export class InscricaoController {
  async criar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await registrarCredenciadoUseCase.executar(req.body);
      res.status(201).json({
        mensagem: 'Credenciamento realizado com sucesso!',
        ...resultado,
      });
    } catch (err) {
      next(err);
    }
  }
}
