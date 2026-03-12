export interface EventoProps {
  id?: string;
  nome: string;
  descricao?: string;
  dataInicio: Date;
  dataFim: Date;
  local: string;
  ativo: boolean;
}

export class Evento {
  private constructor(public readonly props: EventoProps) {}

  static criar(props: EventoProps): Evento {
    return new Evento(props);
  }

  get id(): string | undefined { return this.props.id; }
  get nome(): string { return this.props.nome; }
  get ativo(): boolean { return this.props.ativo; }
}
