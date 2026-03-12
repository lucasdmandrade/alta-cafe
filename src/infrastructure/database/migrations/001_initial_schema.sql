-- ALTA CAFÉ — Schema inicial
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE categoria_credenciamento AS ENUM (
  'EXPOSITOR',
  'CAFEICULTOR',
  'VISITANTE',
  'IMPRENSA',
  'COMISSAO_ORGANIZADORA',
  'COLABORADOR'
);

CREATE TYPE tipo_combustivel AS ENUM (
  'GASOLINA',
  'ALCOOL',
  'DIESEL',
  'ELETRICO'
);

CREATE TABLE eventos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome        VARCHAR(255) NOT NULL,
  descricao   TEXT,
  data_inicio DATE NOT NULL,
  data_fim    DATE NOT NULL,
  local       VARCHAR(255) NOT NULL DEFAULT 'Franca/SP',
  ativo       BOOLEAN NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE credenciados (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome                 VARCHAR(255) NOT NULL,
  email                VARCHAR(255) NOT NULL UNIQUE,
  telefone             VARCHAR(20),
  empresa              VARCHAR(255),
  cargo                VARCHAR(255),
  documento_tipo       VARCHAR(10) NOT NULL,
  documento_numero     VARCHAR(20) NOT NULL,
  endereco_cep         VARCHAR(10),
  endereco_logradouro  VARCHAR(255),
  endereco_numero      VARCHAR(20),
  endereco_complemento VARCHAR(100),
  endereco_bairro      VARCHAR(100),
  endereco_cidade      VARCHAR(100),
  endereco_uf          CHAR(2),
  categoria            categoria_credenciamento NOT NULL,
  nome_veiculo         VARCHAR(100),
  numero_registro      VARCHAR(50),
  area_atuacao         VARCHAR(100),
  cidade_origem        VARCHAR(100),
  combustivel          tipo_combustivel,
  co2_estimado_kg      NUMERIC(10,3),
  aceite_lgpd          BOOLEAN NOT NULL DEFAULT false,
  aceite_lgpd_em       TIMESTAMPTZ,
  criado_em            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE credenciais (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credenciado_id      UUID NOT NULL UNIQUE REFERENCES credenciados(id) ON DELETE CASCADE,
  qr_code_data        TEXT NOT NULL,
  qr_code_imagem_b64  TEXT,
  valida              BOOLEAN NOT NULL DEFAULT true,
  emitida_em          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_acessos       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE logs_acesso (
  id              BIGSERIAL PRIMARY KEY,
  credencial_id   UUID NOT NULL REFERENCES credenciais(id),
  resultado       VARCHAR(20) NOT NULL,
  validado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios_admin (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL,
  nome        VARCHAR(255) NOT NULL,
  ativo       BOOLEAN NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credenciados_email     ON credenciados(email);
CREATE INDEX idx_credenciados_categoria ON credenciados(categoria);
CREATE INDEX idx_credenciais_credenciado ON credenciais(credenciado_id);
CREATE INDEX idx_credenciais_qr         ON credenciais(qr_code_data);

-- Trigger para atualizar atualizado_em
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_credenciados_atualizado_em
  BEFORE UPDATE ON credenciados
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

-- Seeds
INSERT INTO eventos (nome, descricao, data_inicio, data_fim, local)
VALUES ('ALTA CAFÉ 2026', 'Feira Internacional do Café de Franca', '2026-04-10', '2026-04-13', 'Clube de Campo da Franca - Franca/SP');

-- Senha padrão: admin123 (bcrypt hash)
INSERT INTO usuarios_admin (email, senha_hash, nome)
VALUES (
  'admin@altacafe.com.br',
  '$2a$12$QaQ0.afpLY8NtvZvAnTbj.YxzPGQ3Iv3aC4IVqpIzEBIqKWpsVfEK',
  'Administrador ALTA CAFÉ'
);
