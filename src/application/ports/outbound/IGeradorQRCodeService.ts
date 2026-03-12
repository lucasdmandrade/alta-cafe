export interface IGeradorQRCodeService {
  gerarComoBase64(conteudo: string): Promise<string>;
  gerarComoBuffer(conteudo: string): Promise<Buffer>;
}
