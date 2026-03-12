import { Documento } from '../value-objects/Documento';
import { Endereco } from '../value-objects/Endereco';
import { CategoriaCredenciamento } from '../value-objects/CategoriaCredenciamento';
import { DomainError } from '../errors/DomainError';

export interface CredenciadoProps {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  documento: Documento;
  endereco: Endereco;
  categoria: CategoriaCredenciamento;
  // Campos condicionais
  nomeVeiculo?: string;      // Imprensa
  numeroRegistro?: string;   // Imprensa (DRT)
  areaAtuacao?: string;      // Cafeicultor
  // Descarbonização
  cidadeOrigem?: string;
  combustivel?: string;
  co2EstimadoKg?: number;
  // Controle
  aceiteLgpd: boolean;
  aceiteLgpdEm?: Date;
  criadoEm?: Date;
}

export class Credenciado {
  private constructor(public readonly props: CredenciadoProps) {}

  static criar(props: CredenciadoProps): Credenciado {
    if (!props.nome || props.nome.trim().length < 2) {
      throw new DomainError('Nome deve ter ao menos 2 caracteres');
    }
    if (!props.email || !props.email.includes('@')) {
      throw new DomainError('E-mail inválido');
    }
    if (!props.aceiteLgpd) {
      throw new DomainError('É obrigatório aceitar os termos da LGPD');
    }

    const camposObrigatorios = props.categoria.camposObrigatorios;
    for (const campo of camposObrigatorios) {
      const valor = (props as unknown as Record<string, unknown>)[campo];
      if (!valor || String(valor).trim() === '') {
        throw new DomainError(`Campo obrigatório para a categoria ${props.categoria.label}: ${campo}`);
      }
    }

    return new Credenciado({
      ...props,
      aceiteLgpdEm: props.aceiteLgpd ? new Date() : undefined,
    });
  }

  get id(): string | undefined { return this.props.id; }
  get nome(): string { return this.props.nome; }
  get email(): string { return this.props.email; }
  get documento(): Documento { return this.props.documento; }
  get categoria(): CategoriaCredenciamento { return this.props.categoria; }
  get empresa(): string | undefined { return this.props.empresa; }
}
