import { Pool } from 'pg';
import { ICredenciadoRepository, ListarCredenciadosOptions } from '../../../application/ports/outbound/ICredenciadoRepository';
import { Credenciado } from '../../../domain/entities/Credenciado';
import { Credencial } from '../../../domain/entities/Credencial';
import { Documento } from '../../../domain/value-objects/Documento';
import { Endereco } from '../../../domain/value-objects/Endereco';
import { CategoriaCredenciamento } from '../../../domain/value-objects/CategoriaCredenciamento';

export class PostgresCredenciadoRepository implements ICredenciadoRepository {
  constructor(private readonly pool: Pool) {}

  async salvar(credenciado: Credenciado): Promise<Credenciado> {
    const p = credenciado.props;
    const { rows } = await this.pool.query(
      `INSERT INTO credenciados (
        nome, email, telefone, empresa, cargo,
        documento_tipo, documento_numero,
        endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento,
        endereco_bairro, endereco_cidade, endereco_uf,
        categoria, nome_veiculo, numero_registro, area_atuacao,
        cidade_origem, combustivel, co2_estimado_kg,
        aceite_lgpd, aceite_lgpd_em
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
      ) RETURNING id, criado_em`,
      [
        p.nome, p.email, p.telefone ?? null, p.empresa ?? null, p.cargo ?? null,
        p.documento.tipo, p.documento.numero,
        p.endereco.cep ?? null, p.endereco.logradouro ?? null, p.endereco.numero ?? null,
        p.endereco.complemento ?? null, p.endereco.bairro ?? null,
        p.endereco.cidade ?? null, p.endereco.uf ?? null,
        p.categoria.valor,
        p.nomeVeiculo ?? null, p.numeroRegistro ?? null, p.areaAtuacao ?? null,
        p.cidadeOrigem ?? null, p.combustivel ?? null, p.co2EstimadoKg ?? null,
        p.aceiteLgpd, p.aceiteLgpdEm ?? null,
      ]
    );

    return Credenciado.criar({ ...p, id: rows[0].id, criadoEm: rows[0].criado_em });
  }

  async buscarPorId(id: string): Promise<Credenciado | null> {
    const { rows } = await this.pool.query('SELECT * FROM credenciados WHERE id = $1', [id]);
    if (!rows[0]) return null;
    return this.mapRow(rows[0]);
  }

  async buscarPorEmail(email: string): Promise<Credenciado | null> {
    const { rows } = await this.pool.query('SELECT * FROM credenciados WHERE email = $1', [email]);
    if (!rows[0]) return null;
    return this.mapRow(rows[0]);
  }

  async listarTodos(opts: ListarCredenciadosOptions = {}): Promise<{ dados: Credenciado[]; total: number }> {
    const { categoria, pagina = 1, limite = 50 } = opts;
    const offset = (pagina - 1) * limite;

    const where = categoria ? 'WHERE categoria = $1' : '';
    const params = categoria ? [categoria] : [];

    const [{ rows }, { rows: countRows }] = await Promise.all([
      this.pool.query(
        `SELECT * FROM credenciados ${where} ORDER BY criado_em DESC LIMIT ${limite} OFFSET ${offset}`,
        params
      ),
      this.pool.query(`SELECT COUNT(*) FROM credenciados ${where}`, params),
    ]);

    return {
      dados: rows.map(r => this.mapRow(r)),
      total: parseInt(countRows[0].count),
    };
  }

  async salvarCredencial(credencial: Credencial): Promise<Credencial> {
    const p = credencial.props;
    const { rows } = await this.pool.query(
      `INSERT INTO credenciais (credenciado_id, qr_code_data, qr_code_imagem_b64)
       VALUES ($1, $2, $3)
       ON CONFLICT (credenciado_id) DO UPDATE
         SET qr_code_data = EXCLUDED.qr_code_data,
             qr_code_imagem_b64 = EXCLUDED.qr_code_imagem_b64
       RETURNING id, emitida_em`,
      [p.credenciadoId, p.qrCodeData, p.qrCodeImagemB64 ?? null]
    );

    return new (Credencial as any)({ ...p, id: rows[0].id, emitidaEm: rows[0].emitida_em });
  }

  async buscarCredencialPorCredenciadoId(credenciadoId: string): Promise<Credencial | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM credenciais WHERE credenciado_id = $1',
      [credenciadoId]
    );
    if (!rows[0]) return null;
    return this.mapCredencialRow(rows[0]);
  }

  async buscarCredencialPorQrCode(qrCodeData: string): Promise<Credencial | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM credenciais WHERE qr_code_data = $1',
      [qrCodeData]
    );
    if (!rows[0]) return null;
    return this.mapCredencialRow(rows[0]);
  }

  async registrarAcesso(credencialId: string, resultado: string): Promise<void> {
    await this.pool.query(
      'UPDATE credenciais SET total_acessos = total_acessos + 1 WHERE id = $1',
      [credencialId]
    );
    await this.pool.query(
      'INSERT INTO logs_acesso (credencial_id, resultado) VALUES ($1, $2)',
      [credencialId, resultado]
    );
  }

  private mapRow(row: Record<string, unknown>): Credenciado {
    return Credenciado.criar({
      id: row.id as string,
      nome: row.nome as string,
      email: row.email as string,
      telefone: row.telefone as string | undefined,
      empresa: row.empresa as string | undefined,
      cargo: row.cargo as string | undefined,
      documento: Documento.criar(row.documento_tipo as string, row.documento_numero as string),
      endereco: Endereco.criar({
        cep: row.endereco_cep as string | undefined,
        logradouro: row.endereco_logradouro as string | undefined,
        numero: row.endereco_numero as string | undefined,
        complemento: row.endereco_complemento as string | undefined,
        bairro: row.endereco_bairro as string | undefined,
        cidade: row.endereco_cidade as string | undefined,
        uf: row.endereco_uf as string | undefined,
      }),
      categoria: CategoriaCredenciamento.criar(row.categoria as string),
      nomeVeiculo: row.nome_veiculo as string | undefined,
      numeroRegistro: row.numero_registro as string | undefined,
      areaAtuacao: row.area_atuacao as string | undefined,
      cidadeOrigem: row.cidade_origem as string | undefined,
      combustivel: row.combustivel as string | undefined,
      co2EstimadoKg: row.co2_estimado_kg ? parseFloat(row.co2_estimado_kg as string) : undefined,
      aceiteLgpd: row.aceite_lgpd as boolean,
      aceiteLgpdEm: row.aceite_lgpd_em as Date | undefined,
      criadoEm: row.criado_em as Date,
    });
  }

  private mapCredencialRow(row: Record<string, unknown>): Credencial {
    return Credencial.criar({
      id: row.id as string,
      credenciadoId: row.credenciado_id as string,
      qrCodeData: row.qr_code_data as string,
      qrCodeImagemB64: row.qr_code_imagem_b64 as string | undefined,
    });
  }
}
