import { ICredenciadoRepository } from '../ports/outbound/ICredenciadoRepository';
import { IGeradorQRCodeService } from '../ports/outbound/IGeradorQRCodeService';
import { CalculadoraDescarbonizacao, TipoCombustivel } from '../../domain/services/CalculadoraDescarbonizacao';
import { Credenciado } from '../../domain/entities/Credenciado';
import { Credencial } from '../../domain/entities/Credencial';
import { Documento } from '../../domain/value-objects/Documento';
import { Endereco } from '../../domain/value-objects/Endereco';
import { CategoriaCredenciamento } from '../../domain/value-objects/CategoriaCredenciamento';
import { DomainError } from '../../domain/errors/DomainError';

export interface RegistrarCredenciadoInput {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  documentoTipo: string;
  documentoNumero: string;
  endereco?: {
    cep?: string; logradouro?: string; numero?: string;
    complemento?: string; bairro?: string; cidade?: string; uf?: string;
  };
  categoria: string;
  nomeVeiculo?: string;
  numeroRegistro?: string;
  areaAtuacao?: string;
  cidadeOrigem?: string;
  combustivel?: string;
  aceiteLgpd: boolean;
}

export interface RegistrarCredenciadoOutput {
  credenciadoId: string;
  credencialId: string;
  qrCodeData: string;
  co2EstimadoKg?: number;
}

export class RegistrarCredenciadoUseCase {
  constructor(
    private readonly repo: ICredenciadoRepository,
    private readonly qrCodeService: IGeradorQRCodeService,
    private readonly calculadora: CalculadoraDescarbonizacao,
  ) {}

  async executar(input: RegistrarCredenciadoInput): Promise<RegistrarCredenciadoOutput> {
    const emailExistente = await this.repo.buscarPorEmail(input.email);
    if (emailExistente) {
      throw new DomainError('E-mail já cadastrado neste evento');
    }

    const documento = Documento.criar(input.documentoTipo, input.documentoNumero);
    const endereco  = Endereco.criar(input.endereco ?? {});
    const categoria = CategoriaCredenciamento.criar(input.categoria);

    let co2EstimadoKg: number | undefined;
    if (input.cidadeOrigem && input.combustivel) {
      try {
        const resultado = this.calculadora.calcular(
          input.cidadeOrigem,
          input.combustivel.toUpperCase() as TipoCombustivel,
        );
        co2EstimadoKg = resultado.co2IdaVoltaKg;
      } catch {
        // não bloqueia o cadastro se o cálculo falhar
      }
    }

    const credenciado = Credenciado.criar({
      nome: input.nome,
      email: input.email,
      telefone: input.telefone,
      empresa: input.empresa,
      cargo: input.cargo,
      documento,
      endereco,
      categoria,
      nomeVeiculo: input.nomeVeiculo,
      numeroRegistro: input.numeroRegistro,
      areaAtuacao: input.areaAtuacao,
      cidadeOrigem: input.cidadeOrigem,
      combustivel: input.combustivel,
      co2EstimadoKg,
      aceiteLgpd: input.aceiteLgpd,
    });

    const credenciadoSalvo = await this.repo.salvar(credenciado);
    const credenciadoId = credenciadoSalvo.id!;

    const qrCodeData = credenciadoId; // UUID é o payload do QR Code
    const qrCodeImagemB64 = await this.qrCodeService.gerarComoBase64(qrCodeData);

    const credencial = Credencial.criar({ credenciadoId, qrCodeData, qrCodeImagemB64 });
    const credencialSalva = await this.repo.salvarCredencial(credencial);

    return {
      credenciadoId,
      credencialId: credencialSalva.id!,
      qrCodeData,
      co2EstimadoKg,
    };
  }
}
