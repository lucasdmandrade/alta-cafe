export type TipoCombustivel = 'GASOLINA' | 'ALCOOL' | 'DIESEL' | 'ELETRICO';

// Fatores de emissão em kg CO₂ por km (média veicular, referência SEEG/IPCC)
const FATORES_EMISSAO: Record<TipoCombustivel, number> = {
  GASOLINA: 0.218,
  ALCOOL:   0.090,
  DIESEL:   0.271,
  ELETRICO: 0.048,
};

// Distâncias em km de cidades até Franca/SP (ida simples)
const DISTANCIAS_KM: Record<string, number> = {
  'SAO PAULO':               398,
  'CAMPINAS':                259,
  'RIBEIRAO PRETO':           79,
  'BELO HORIZONTE':          564,
  'BRASILIA':                930,
  'RIO DE JANEIRO':          666,
  'CURITIBA':                758,
  'PORTO ALEGRE':           1260,
  'FLORIANOPOLIS':           964,
  'SALVADOR':               2030,
  'FORTALEZA':              2900,
  'RECIFE':                 2650,
  'MANAUS':                 3700,
  'BELEM':                  2850,
  'GOIANIA':                 816,
  'CUIABA':                 1400,
  'CAMPO GRANDE':           1180,
  'UBERLANDIA':              297,
  'MARILIA':                 218,
  'PRESIDENTE PRUDENTE':     356,
  'BAURU':                   229,
  'SOROCABA':                367,
  'JUNDIAI':                 323,
  'PIRACICABA':              305,
  'SAO JOSE DO RIO PRETO':   191,
  'ARACATUBA':               291,
  'FRANCA':                    0,
  'MOCOCA':                   82,
  'PATROCINIO PAULISTA':      34,
  'CRISTAIS PAULISTA':        40,
  'ITIRAPUA':                 45,
  'RESTINGA':                 38,
  'JERIQUARA':                52,
  'BURITIZAL':                60,
  'GUARA':                    70,
  'IPUA':                     55,
  'SALES OLIVEIRA':           65,
};

export interface ResultadoDescarbonizacao {
  cidadeOrigem: string;
  distanciaKm: number;
  combustivel: TipoCombustivel;
  co2IdaKg: number;
  co2IdaVoltaKg: number;
  equivalenteArvores: number;
  estimativa: boolean; // true se cidade não estava no array
}

export class CalculadoraDescarbonizacao {
  calcular(cidadeOrigem: string, combustivel: TipoCombustivel): ResultadoDescarbonizacao {
    const cidadeNormalizada = cidadeOrigem
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();

    const distanciaIda = DISTANCIAS_KM[cidadeNormalizada];
    const estimativa = distanciaIda === undefined;
    const distancia = estimativa ? 500 : distanciaIda;

    const fator = FATORES_EMISSAO[combustivel];
    const co2Ida = distancia * fator;
    const co2IdaVolta = co2Ida * 2;
    const equivalenteArvores = Math.ceil(co2IdaVolta / 22); // ~22 kg CO₂/ano por árvore (INPE)

    return {
      cidadeOrigem,
      distanciaKm: distancia,
      combustivel,
      co2IdaKg: parseFloat(co2Ida.toFixed(3)),
      co2IdaVoltaKg: parseFloat(co2IdaVolta.toFixed(3)),
      equivalenteArvores,
      estimativa,
    };
  }

  listarCidades(): string[] {
    return Object.keys(DISTANCIAS_KM).sort();
  }
}
