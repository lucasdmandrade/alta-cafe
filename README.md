# ALTA CAFÉ — Sistema de Credenciamento

Hackathon FATEC Franca · Arquitetura Hexagonal (Ports and Adapters)

## Stack
- Node.js + TypeScript + Express
- PostgreSQL (Docker)
- Puppeteer (geração de PDF)
- JWT (autenticação admin)

## Subir o projeto

```bash
# 1. Banco de dados
docker compose up -d

# 2. Dependências
npm install

# 3. Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## Páginas

| Página | URL |
|--------|-----|
| Inscrição | http://localhost:3000 |
| Validação de QR Code | http://localhost:3000/validar.html |
| Painel Admin | http://localhost:3000/admin.html |

## Credenciais de Admin

- **E-mail:** admin@altacafe.com.br
- **Senha:** admin123

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/inscricao | Cadastrar credenciado |
| GET | /api/credencial/:id/pdf | Download do PDF |
| POST | /api/validar-acesso | Validar QR Code |
| POST | /api/auth/login | Login admin |
| GET | /api/admin/credenciados | Listar (JWT) |
| POST | /api/descarbonizacao | Calcular CO₂ |
| GET | /api/descarbonizacao/cidades | Listar cidades mapeadas |

## Categorias

| Categoria | Campos extras |
|-----------|--------------|
| VISITANTE | — |
| EXPOSITOR | empresa, cargo |
| CAFEICULTOR | empresa, areaAtuacao |
| IMPRENSA | empresa, nomeVeiculo, numeroRegistro |
| COMISSAO_ORGANIZADORA | cargo |
| COLABORADOR | empresa, cargo |

## Exemplo de inscrição via curl

```bash
curl -X POST http://localhost:3000/api/inscricao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@test.com",
    "categoria": "VISITANTE",
    "documentoTipo": "CPF",
    "documentoNumero": "529.982.247-25",
    "aceiteLgpd": true
  }'
```
