import QRCode from 'qrcode';
import { IGeradorQRCodeService } from '../../application/ports/outbound/IGeradorQRCodeService';

export class QRCodeAdapter implements IGeradorQRCodeService {
  async gerarComoBase64(conteudo: string): Promise<string> {
    const dataUrl = await QRCode.toDataURL(conteudo, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: { dark: '#3B1A08', light: '#FFFFFF' },
    });
    return dataUrl.split(',')[1]; // remove prefixo data:image/png;base64,
  }

  async gerarComoBuffer(conteudo: string): Promise<Buffer> {
    return QRCode.toBuffer(conteudo, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
    });
  }
}
