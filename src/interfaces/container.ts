import { pool } from '../infrastructure/database/connection';
import { PostgresCredenciadoRepository } from '../infrastructure/database/repositories/PostgresCredenciadoRepository';
import { QRCodeAdapter } from '../infrastructure/services/QRCodeAdapter';
import { PuppeteerPdfAdapter } from '../infrastructure/services/PuppeteerPdfAdapter';
import { CalculadoraDescarbonizacao } from '../domain/services/CalculadoraDescarbonizacao';
import { RegistrarCredenciadoUseCase } from '../application/use-cases/RegistrarCredenciadoUseCase';
import { GerarCredencialImpressaUseCase } from '../application/use-cases/GerarCredencialImpressaUseCase';
import { AutenticarUsuarioUseCase } from '../application/use-cases/AutenticarUsuarioUseCase';

// Adaptadores
const credenciadoRepository = new PostgresCredenciadoRepository(pool);
const qrCodeAdapter         = new QRCodeAdapter();
const pdfAdapter            = new PuppeteerPdfAdapter();
const calculadora           = new CalculadoraDescarbonizacao();

// Use Cases (exportados para uso nos controllers)
export const registrarCredenciadoUseCase    = new RegistrarCredenciadoUseCase(credenciadoRepository, qrCodeAdapter, calculadora);
export const gerarCredencialImpressaUseCase = new GerarCredencialImpressaUseCase(credenciadoRepository, qrCodeAdapter, pdfAdapter);
export const autenticarUsuarioUseCase       = new AutenticarUsuarioUseCase(pool);

// Repositório exposto para uso direto nos controllers admin/validação
export { credenciadoRepository, calculadora };
