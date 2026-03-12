export interface CredencialProps {
  id?: string;
  credenciadoId: string;
  qrCodeData: string;
  qrCodeImagemB64?: string;
  valida: boolean;
  emitidaEm?: Date;
  totalAcessos: number;
}

export class Credencial {
  private constructor(public readonly props: CredencialProps) {}

  static criar(props: Omit<CredencialProps, 'valida' | 'totalAcessos' | 'emitidaEm'>): Credencial {
    return new Credencial({
      ...props,
      valida: true,
      totalAcessos: 0,
      emitidaEm: new Date(),
    });
  }

  get id(): string | undefined { return this.props.id; }
  get credenciadoId(): string { return this.props.credenciadoId; }
  get qrCodeData(): string { return this.props.qrCodeData; }
  get qrCodeImagemB64(): string | undefined { return this.props.qrCodeImagemB64; }
  get valida(): boolean { return this.props.valida; }
  get totalAcessos(): number { return this.props.totalAcessos; }
}
