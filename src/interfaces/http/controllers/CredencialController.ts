import { Request, Response, NextFunction } from 'express';
import { gerarCredencialImpressaUseCase } from '../../container';

export class CredencialController {
  async gerarPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pdfBuffer = await gerarCredencialImpressaUseCase.executar(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="credencial-${id}.pdf"`);
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
}
