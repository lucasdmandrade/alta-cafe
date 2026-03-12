import { Request, Response, NextFunction } from 'express';
import { autenticarUsuarioUseCase } from '../../container';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
        return;
      }
      const resultado = await autenticarUsuarioUseCase.executar({ email, senha });
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }
}
