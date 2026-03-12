export interface DadosCredencialPdf {
  nome: string;
  empresa?: string;
  categoria: string;
  corTarja: string;
  qrCodeBase64: string;
  credencialId: string;
  dataEvento: string;
  documentoFormatado: string;
}

export interface IGeradorPdfService {
  gerarCredencial(dados: DadosCredencialPdf): Promise<Buffer>;
}
