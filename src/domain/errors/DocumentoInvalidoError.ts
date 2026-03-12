import { DomainError } from './DomainError';

export class DocumentoInvalidoError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'DocumentoInvalidoError';
  }
}
