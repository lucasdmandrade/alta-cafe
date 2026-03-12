# ALTA CAFÉ — Sistema de Credenciamento

> Projeto desenvolvido para o **Hackathon FATEC Franca 2026**, sob orientação das professoras Eliza Maria da Cunha Bomfim e Leonardo Henrique Raiz.

---

## Sobre o Desafio

O Hackathon propôs a criação de um sistema de credenciamento presencial e online para a **Feira Internacional do Café de Franca/SP — ALTA CAFÉ**, com tempo limite de **12 horas** de desenvolvimento.

### Requisitos do desafio

| # | Requisito | Complexidade |
|---|-----------|-------------|
| US01 | Formulário de inscrição condicional por categoria com aceite de LGPD | Média |
| US02 | Flag de modalidade (gratuito/pago) no banco de dados | Baixa |
| US03 | Geração de credencial em PDF — folha A4 dividida em 4 partes para dobra e impressão | Alta |
| US04 | QR Code único por credenciado embutido no PDF | Baixa |
| US05 | Endpoint de validação de acesso via leitura do QR Code pela câmera | Média |
| US06 | Painel administrativo com acesso protegido por login e senha | Baixa |
| US07 | Calculadora de pegada de carbono do deslocamento até Franca/SP | Média |

### 6 categorias de credenciamento
- **Expositor** — empresa + cargo
- **Cafeicultor** — fazenda + área de atuação
- **Visitante** — dados básicos
- **Imprensa** — veículo + nº de registro (DRT)
- **Comissão Organizadora** — cargo
- **Colaborador** — empresa + cargo

### Arquitetura obrigatória
O desafio exigiu o uso de **Arquitetura Hexagonal (Ports and Adapters)**, isolando o domínio de negócio de qualquer dependência de infraestrutura.

---

## Tempo de conclusão

O projeto foi integralmente gerado por **Claude (Anthropic)** em uma única sessão de desenvolvimento assistido por IA, em **aproximadamente 35 minutos** — desde a leitura da documentação arquitetural até o push final no GitHub, contemplando todas as User Stories do backlog ágil proposto.

---

## Ferramentas utilizadas

| Categoria | Tecnologia |
|-----------|-----------|
| Linguagem | TypeScript |
| Runtime | Node.js |
| Framework HTTP | Express |
| Banco de dados | PostgreSQL |
| Containerização | Docker + Docker Compose |
| Geração de PDF | Puppeteer (HTML → PDF) |
| QR Code | qrcode (geração) + jsQR (leitura via câmera) |
| Autenticação | JWT (jsonwebtoken) + bcryptjs |
| Validação | Zod |
| ORM / Query | pg (driver direto, sem ORM) |
| Frontend | HTML5 + CSS3 + JavaScript puro (sem framework) |
| Arquitetura | Hexagonal (Ports and Adapters) |
| Controle de versão | Git + GitHub |

---

## Como rodar o projeto

```bash
# 1. Banco de dados (schema aplicado automaticamente na primeira subida)
docker compose up -d

# 2. Dependências
npm install

# 3. Rodar em desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

---

## Páginas

| Página | URL |
|--------|-----|
| Inscrição | http://localhost:3000 |
| Validação de QR Code | http://localhost:3000/validar.html |
| Painel Admin | http://localhost:3000/admin.html |

---

## Credenciais de Admin

- **E-mail:** admin@altacafe.com.br
- **Senha:** admin123

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/inscricao | Cadastrar credenciado |
| GET | /api/credencial/:id/pdf | Download do PDF |
| POST | /api/validar-acesso | Validar QR Code |
| POST | /api/auth/login | Login admin |
| GET | /api/admin/credenciados | Listar credenciados (JWT) |
| POST | /api/descarbonizacao | Calcular pegada de carbono |
| GET | /api/descarbonizacao/cidades | Listar cidades mapeadas |

---

## Categorias

| Categoria | Campos extras obrigatórios |
|-----------|---------------------------|
| VISITANTE | — |
| EXPOSITOR | empresa, cargo |
| CAFEICULTOR | empresa, areaAtuacao |
| IMPRENSA | empresa, nomeVeiculo, numeroRegistro |
| COMISSAO_ORGANIZADORA | cargo |
| COLABORADOR | empresa, cargo |

---

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
