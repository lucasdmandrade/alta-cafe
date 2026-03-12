import { cpfCnpjUtils } from '../../shared/validators/cpfCnpjUtils';
import { DocumentoInvalidoError } from '../errors/DocumentoInvalidoError';

export type TipoDocumento = 'CPF' | 'CNPJ' | 'RG';

export class Documento {
  private constructor(
    public readonly tipo: TipoDocumento,
    public readonly numero: string,
  ) {}

  static criar(tipo: string, numero: string): Documento {
    const tipoUpper = tipo.toUpperCase() as TipoDocumento;
    const apenasDigitos = numero.replace(/\D/g, '');

    switch (tipoUpper) {
      case 'CPF':
        if (!cpfCnpjUtils.validarCPF(apenasDigitos)) {
          throw new DocumentoInvalidoError('CPF inválido');
        }
        return new Documento('CPF', apenasDigitos);

      case 'CNPJ':
        if (!cpfCnpjUtils.validarCNPJ(apenasDigitos)) {
          throw new DocumentoInvalidoError('CNPJ inválido');
        }
        return new Documento('CNPJ', apenasDigitos);

      case 'RG':
        if (apenasDigitos.length < 5 || apenasDigitos.length > 14) {
          throw new DocumentoInvalidoError('RG inválido (deve ter entre 5 e 14 dígitos)');
        }
        return new Documento('RG', apenasDigitos);

      default:
        throw new DocumentoInvalidoError(`Tipo de documento não suportado: ${tipo}`);
    }
  }

  formatado(): string {
    if (this.tipo === 'CPF') {
      return this.numero.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (this.tipo === 'CNPJ') {
      return this.numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return this.numero;
  }
}
