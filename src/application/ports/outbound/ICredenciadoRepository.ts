import { Credenciado } from '../../../domain/entities/Credenciado';
import { Credencial } from '../../../domain/entities/Credencial';

export interface ListarCredenciadosOptions {
  categoria?: string;
  pagina?: number;
  limite?: number;
}

export interface ICredenciadoRepository {
  salvar(credenciado: Credenciado): Promise<Credenciado>;
  buscarPorId(id: string): Promise<Credenciado | null>;
  buscarPorEmail(email: string): Promise<Credenciado | null>;
  listarTodos(opts?: ListarCredenciadosOptions): Promise<{ dados: Credenciado[]; total: number }>;
  salvarCredencial(credencial: Credencial): Promise<Credencial>;
  buscarCredencialPorCredenciadoId(credenciadoId: string): Promise<Credencial | null>;
  buscarCredencialPorQrCode(qrCodeData: string): Promise<Credencial | null>;
  registrarAcesso(credencialId: string, resultado: string): Promise<void>;
}
