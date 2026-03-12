import { Request, Response, NextFunction } from 'express';
import { credenciadoRepository } from '../../container';

export class AcessoController {
  async validar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { qrCodeData } = req.body;

      if (!qrCodeData) {
        res.status(400).json({ erro: 'qrCodeData é obrigatório' });
        return;
      }

      const credencial = await credenciadoRepository.buscarCredencialPorQrCode(qrCodeData);

      if (!credencial || !credencial.valida) {
        res.status(200).json({ resultado: 'Acesso Negado', motivo: 'Credencial não encontrada ou inválida' });
        return;
      }

      await credenciadoRepository.registrarAcesso(credencial.id!, 'AUTORIZADO');

      res.status(200).json({
        resultado: 'Acesso Liberado',
        credencialId: credencial.id,
        totalAcessos: credencial.totalAcessos + 1,
      });
    } catch (err) {
      next(err);
    }
  }
}
