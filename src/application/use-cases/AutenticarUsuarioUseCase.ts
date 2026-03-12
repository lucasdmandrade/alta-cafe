import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DomainError } from '../../domain/errors/DomainError';

export interface AutenticarInput {
  email: string;
  senha: string;
}

export interface AutenticarOutput {
  token: string;
  nome: string;
  email: string;
}

export class AutenticarUsuarioUseCase {
  constructor(private readonly pool: Pool) {}

  async executar(input: AutenticarInput): Promise<AutenticarOutput> {
    const { rows } = await this.pool.query(
      'SELECT * FROM usuarios_admin WHERE email = $1 AND ativo = true',
      [input.email]
    );

    if (!rows[0]) throw new DomainError('Credenciais inválidas');

    const senhaValida = await bcrypt.compare(input.senha, rows[0].senha_hash);
    if (!senhaValida) throw new DomainError('Credenciais inválidas');

    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '8h') as `${number}${'s' | 'm' | 'h' | 'd'}`;
    const token = jwt.sign(
      { adminId: rows[0].id, email: rows[0].email },
      process.env.JWT_SECRET!,
      { expiresIn }
    );

    return { token, nome: rows[0].nome, email: rows[0].email };
  }
}
