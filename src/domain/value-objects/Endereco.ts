export class Endereco {
  private constructor(
    public readonly cep: string | undefined,
    public readonly logradouro: string | undefined,
    public readonly numero: string | undefined,
    public readonly complemento: string | undefined,
    public readonly bairro: string | undefined,
    public readonly cidade: string | undefined,
    public readonly uf: string | undefined,
  ) {}

  static criar(dados: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  }): Endereco {
    return new Endereco(
      dados.cep,
      dados.logradouro,
      dados.numero,
      dados.complemento,
      dados.bairro,
      dados.cidade,
      dados.uf,
    );
  }

  static vazio(): Endereco {
    return new Endereco(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  }
}
