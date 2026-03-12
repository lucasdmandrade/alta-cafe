import { ICredenciadoRepository } from '../ports/outbound/ICredenciadoRepository';
import { IGeradorQRCodeService } from '../ports/outbound/IGeradorQRCodeService';
import { IGeradorPdfService } from '../ports/outbound/IGeradorPdfService';
import { DomainError } from '../../domain/errors/DomainError';

export class GerarCredencialImpressaUseCase {
  constructor(
    private readonly repo: ICredenciadoRepository,
    private readonly qrCodeService: IGeradorQRCodeService,
    private readonly pdfService: IGeradorPdfService,
  ) {}

  async executar(credenciadoId: string): Promise<Buffer> {
    const credenciado = await this.repo.buscarPorId(credenciadoId);
    if (!credenciado) throw new DomainError('Credenciado não encontrado');

    let credencial = await this.repo.buscarCredencialPorCredenciadoId(credenciadoId);
    if (!credencial) throw new DomainError('Credencial não emitida para este credenciado');

    // Garante que o QR Code base64 esteja presente
    let qrCodeBase64 = credencial.qrCodeImagemB64;
    if (!qrCodeBase64) {
      qrCodeBase64 = await this.qrCodeService.gerarComoBase64(credencial.qrCodeData);
    }

    const pdfBuffer = await this.pdfService.gerarCredencial({
      nome: credenciado.nome,
      empresa: credenciado.empresa,
      categoria: credenciado.categoria.label,
      corTarja: credenciado.categoria.corTarja,
      qrCodeBase64,
      credencialId: credencial.id!,
      dataEvento: '10 a 13 de Abril de 2026 · Franca/SP',
      documentoFormatado: credenciado.documento.formatado(),
    });

    return pdfBuffer;
  }
}
