export enum CategoriaCredenciamentoEnum {
  EXPOSITOR             = 'EXPOSITOR',
  CAFEICULTOR           = 'CAFEICULTOR',
  VISITANTE             = 'VISITANTE',
  IMPRENSA              = 'IMPRENSA',
  COMISSAO_ORGANIZADORA = 'COMISSAO_ORGANIZADORA',
  COLABORADOR           = 'COLABORADOR',
}

export const CAMPOS_OBRIGATORIOS_POR_CATEGORIA: Record<CategoriaCredenciamentoEnum, string[]> = {
  [CategoriaCredenciamentoEnum.EXPOSITOR]:             ['empresa', 'cargo'],
  [CategoriaCredenciamentoEnum.CAFEICULTOR]:           ['empresa', 'areaAtuacao'],
  [CategoriaCredenciamentoEnum.VISITANTE]:             [],
  [CategoriaCredenciamentoEnum.IMPRENSA]:              ['empresa', 'nomeVeiculo', 'numeroRegistro'],
  [CategoriaCredenciamentoEnum.COMISSAO_ORGANIZADORA]: ['cargo'],
  [CategoriaCredenciamentoEnum.COLABORADOR]:           ['empresa', 'cargo'],
};

export const COR_TARJA: Record<CategoriaCredenciamentoEnum, string> = {
  [CategoriaCredenciamentoEnum.EXPOSITOR]:             '#B8860B',
  [CategoriaCredenciamentoEnum.CAFEICULTOR]:           '#6F4E37',
  [CategoriaCredenciamentoEnum.VISITANTE]:             '#2E8B57',
  [CategoriaCredenciamentoEnum.IMPRENSA]:              '#4169E1',
  [CategoriaCredenciamentoEnum.COMISSAO_ORGANIZADORA]: '#8B0000',
  [CategoriaCredenciamentoEnum.COLABORADOR]:           '#696969',
};

export const LABEL_CATEGORIA: Record<CategoriaCredenciamentoEnum, string> = {
  [CategoriaCredenciamentoEnum.EXPOSITOR]:             'Expositor',
  [CategoriaCredenciamentoEnum.CAFEICULTOR]:           'Cafeicultor',
  [CategoriaCredenciamentoEnum.VISITANTE]:             'Visitante',
  [CategoriaCredenciamentoEnum.IMPRENSA]:              'Imprensa',
  [CategoriaCredenciamentoEnum.COMISSAO_ORGANIZADORA]: 'Comissão Organizadora',
  [CategoriaCredenciamentoEnum.COLABORADOR]:           'Colaborador',
};

export class CategoriaCredenciamento {
  private constructor(public readonly valor: CategoriaCredenciamentoEnum) {}

  static criar(valor: string): CategoriaCredenciamento {
    const upper = valor.toUpperCase() as CategoriaCredenciamentoEnum;
    if (!Object.values(CategoriaCredenciamentoEnum).includes(upper)) {
      throw new Error(`Categoria inválida: ${valor}. Opções: ${Object.values(CategoriaCredenciamentoEnum).join(', ')}`);
    }
    return new CategoriaCredenciamento(upper);
  }

  get corTarja(): string { return COR_TARJA[this.valor]; }
  get camposObrigatorios(): string[] { return CAMPOS_OBRIGATORIOS_POR_CATEGORIA[this.valor]; }
  get label(): string { return LABEL_CATEGORIA[this.valor]; }
  toString(): string { return this.valor; }
}
