import { Request, Response, NextFunction } from 'express';
import { credenciadoRepository } from '../../container';

export class AdminController {
  async listarCredenciados(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoria = req.query['categoria'] as string | undefined;
      const pagina = parseInt(req.query['pagina'] as string ?? '1');
      const limite = parseInt(req.query['limite'] as string ?? '50');

      const { dados, total } = await credenciadoRepository.listarTodos({ categoria, pagina, limite });

      res.json({
        total,
        pagina,
        limite,
        dados: dados.map(c => ({
          id: c.id,
          nome: c.nome,
          email: c.email,
          categoria: c.categoria.valor,
          categoriaLabel: c.categoria.label,
          empresa: c.empresa,
          documento: c.documento.formatado(),
          co2EstimadoKg: c.props.co2EstimadoKg,
          criadoEm: c.props.criadoEm,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
}
