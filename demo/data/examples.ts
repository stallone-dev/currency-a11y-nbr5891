import { mapAllOutputs } from "../logic/mapper.ts";
import { CalcAUD } from "@calc-aud-nbr-a11y";

type ExampleOutput = Record<string, string | number | null>;

export const getCategorizedExamples = () => {
  const globalRegistry: Record<string, Record<string, ExampleOutput>> = {};

  const register = (category: string, key: string, data: ExampleOutput) => {
    if (!globalRegistry[category]) globalRegistry[category] = {};
    globalRegistry[category][key] = data;
    return data;
  };

  const examples = {
    outputs: {
      verbalMonetary: [
        {
          title: "Locale PT-BR (Padrão)",
          context: "Formatação padrão brasileira para valores monetários.",
          code:
            "CalcAUD.from('1500.50').add(0.75).commit(2, { locale: 'pt-BR' })",
          outputs: register(
            "outputs",
            "verbalMonetary_ptBR",
            mapAllOutputs(
              CalcAUD.from("1500.50").add(0.75).commit(2, { locale: "pt-BR" }),
            ),
          ),
        },
        {
          title: "Locale EN-US (Internacional)",
          context:
            "Formatação americana com ponto decimal e separador de milhares.",
          code:
            "CalcAUD.from('1500.50').add(0.75).commit(2, { locale: 'en-US' })",
          outputs: register(
            "outputs",
            "verbalMonetary_enUS",
            mapAllOutputs(
              CalcAUD.from("1500.50").add(0.75).commit(2, { locale: "en-US" }),
            ),
          ),
        },
        {
          title: "Locale fr-FR (Europeu)",
          context: "Formatação francesa (vírgula decimal, ponto milhar).",
          code: "CalcAUD.from('1234567.89').commit(2, { locale: 'fr-FR' })",
          outputs: register(
            "outputs",
            "verbalMonetary_deDE",
            mapAllOutputs(
              CalcAUD.from("1234567.89").commit(2, { locale: "fr-FR" }),
            ),
          ),
        },
        {
          title: "Locale JA-JP (Iene)",
          context:
            "Formatação japonesa (sem casas decimais usuais para Iene, mas forçadas aqui).",
          code:
            "CalcAUD.from('5000').mult(1.10).commit(0, { locale: 'ja-JP' })",
          outputs: register(
            "outputs",
            "verbalMonetary_jaJP",
            mapAllOutputs(
              CalcAUD.from("5000").mult(1.10).commit(0, { locale: "ja-JP" }),
            ),
          ),
        },
      ],
      currencyOptions: [
        {
          title: "BRL em Locale US",
          context: "Exibindo Reais com formatação numérica americana.",
          code:
            "CalcAUD.from(1000).commit(2, { locale: 'en-US', currency: 'BRL' })",
          outputs: register(
            "outputs",
            "currency_brl_in_us",
            mapAllOutputs(
              CalcAUD.from(1000).commit(2, {
                locale: "en-US",
                currency: "BRL",
              }),
            ),
          ),
        },
        {
          title: "EUR em Locale BR",
          context: "Exibindo Euros com formatação numérica brasileira.",
          code:
            "CalcAUD.from(50.55).commit(2, { locale: 'pt-BR', currency: 'EUR' })",
          outputs: register(
            "outputs",
            "currency_eur_in_br",
            mapAllOutputs(
              CalcAUD.from(50.55).commit(2, {
                locale: "pt-BR",
                currency: "EUR",
              }),
            ),
          ),
        },
        {
          title: "Bitcoin (XBT) Simulado",
          context:
            "Moeda customizada via código ISO (se suportado pelo Intl) ou fallback.",
          code: "CalcAUD.from(0.0045).commit(8, { currency: 'BTC' })", // BTC often works in modern browsers
          outputs: register(
            "outputs",
            "currency_btc",
            mapAllOutputs(
              CalcAUD.from(0.0045).commit(8, { currency: "BTC" }),
            ),
          ),
        },
      ],
      roundingShowcase: [
        {
          title: "NBR-5891 (Bancário/Par)",
          context: "2.5 -> 2 (Par mais próximo)",
          code: "CalcAUD.from(2.5).commit(0, { roundingMethod: 'NBR-5891' })",
          outputs: register(
            "outputs",
            "rounding_nbr_even",
            mapAllOutputs(
              CalcAUD.from(2.5).commit(0, { roundingMethod: "NBR-5891" }),
            ),
          ),
        },
        {
          title: "NBR-5891 (Ímpar)",
          context: "3.5 -> 4 (Par mais próximo)",
          code: "CalcAUD.from(3.5).commit(0, { roundingMethod: 'NBR-5891' })",
          outputs: register(
            "outputs",
            "rounding_nbr_odd",
            mapAllOutputs(
              CalcAUD.from(3.5).commit(0, { roundingMethod: "NBR-5891" }),
            ),
          ),
        },
        {
          title: "HALF-UP (Comercial)",
          context: "2.5 -> 3 (Sempre para cima no meio)",
          code: "CalcAUD.from(2.5).commit(0, { roundingMethod: 'HALF-UP' })",
          outputs: register(
            "outputs",
            "rounding_half_up",
            mapAllOutputs(
              CalcAUD.from(2.5).commit(0, { roundingMethod: "HALF-UP" }),
            ),
          ),
        },
        {
          title: "TRUNCATE (Corte)",
          context: "2.99 -> 2 (Descarta decimais)",
          code: "CalcAUD.from(2.99).commit(0, { roundingMethod: 'TRUNCATE' })",
          outputs: register(
            "outputs",
            "rounding_truncate",
            mapAllOutputs(
              CalcAUD.from(2.99).commit(0, { roundingMethod: "TRUNCATE" }),
            ),
          ),
        },
        {
          title: "CEIL (Teto)",
          context: "2.01 -> 3 (Próximo inteiro)",
          code: "CalcAUD.from(2.01).commit(0, { roundingMethod: 'CEIL' })",
          outputs: register(
            "outputs",
            "rounding_ceil",
            mapAllOutputs(
              CalcAUD.from(2.01).commit(0, { roundingMethod: "CEIL" }),
            ),
          ),
        },
      ],
      strategyShowcase: [
        {
          title: "Divisão Inteira Euclidiana",
          context: "-10 / 3 = -4 (Piso)",
          code:
            "CalcAUD.from(-10).divInt(3, 'euclidean').commit(0)",
          outputs: register(
            "outputs",
            "strategy_divint_euclidean",
            mapAllOutputs(
              CalcAUD.from(-10).divInt(3, "euclidean")
                .commit(0),
            ),
          ),
        },
        {
          title: "Divisão Inteira Truncada",
          context: "-10 / 3 = -3 (Corte zero)",
          code:
            "CalcAUD.from(-10).divInt(3, 'truncated').commit(0)",
          outputs: register(
            "outputs",
            "strategy_divint_truncated",
            mapAllOutputs(
              CalcAUD.from(-10).divInt(3, "truncated")
                .commit(0),
            ),
          ),
        },
        {
          title: "Módulo Euclidiano",
          context: "-10 % 3 = 2 (Resto positivo)",
          code:
            "CalcAUD.from(-10).mod(3, 'euclidean').commit(0)",
          outputs: register(
            "outputs",
            "strategy_mod_euclidean",
            mapAllOutputs(
              CalcAUD.from(-10).mod(3, "euclidean")
                .commit(0),
            ),
          ),
        },
        {
          title: "Módulo Truncado",
          context: "-10 % 3 = -1 (Sinal do dividendo)",
          code:
            "CalcAUD.from(-10).mod(3, 'truncated').commit(0)",
          outputs: register(
            "outputs",
            "strategy_mod_truncated",
            mapAllOutputs(
              CalcAUD.from(-10).mod(3, "truncated")
                .commit(0),
            ),
          ),
        },
      ],
      toString: [
        {
          title: "Cadeia de Soma Complexa",
          context: "Soma de múltiplos valores decimais flutuantes.",
          code:
            "CalcAUD.from('0.1').add('0.2').add('0.3').sub('0.4').commit(2).toString()",
          outputs: register(
            "outputs",
            "toString_chain",
            mapAllOutputs(
              CalcAUD.from("0.1").add("0.2").add("0.3").sub("0.4").commit(2),
            ),
          ),
        },
        {
          title: "Grande Escala Financeira",
          context: "Orçamento governamental (Bilhões).",
          code:
            "CalcAUD.from('1500000000.00').add('350000000.50').commit(2).toString()",
          outputs: register(
            "outputs",
            "toString_large",
            mapAllOutputs(
              CalcAUD.from("1500000000.00").add("350000000.50").commit(2),
            ),
          ),
        },
      ],
      toFloatNumber: [
        {
          title: "Precisão em Dízimas",
          context: "1/3 com 10 casas decimais.",
          code: "CalcAUD.from(1).div(3).commit(10).toFloatNumber()",
          outputs: register(
            "outputs",
            "toFloat_precision",
            mapAllOutputs(
              CalcAUD.from(1).div(3).commit(10),
            ),
          ),
        },
        {
          title: "Valor Presente Líquido (VPL)",
          context: "1000 / (1.1)^5",
          code:
            "CalcAUD.from(1000).div(CalcAUD.from(1.1).pow(5)).commit(2).toFloatNumber()",
          outputs: register(
            "outputs",
            "toFloat_vpl",
            mapAllOutputs(
              CalcAUD.from(1000).div(CalcAUD.from(1.1).pow(5)).commit(2),
            ),
          ),
        },
      ],
      toRawInternalBigInt: [
        {
          title: "Representação Interna (Scale 10^8)",
          context: "Visualização do BigInt subjacente.",
          code: "CalcAUD.from(1).commit().toRawInternalBigInt()",
          outputs: register(
            "outputs",
            "raw_int_simple",
            mapAllOutputs(
              CalcAUD.from(1).commit(),
            ),
          ),
        },
        {
          title: "Limites Seguros JS",
          context: "MAX_SAFE_INTEGER + 1 via BigInt interno.",
          code:
            "CalcAUD.from(Number.MAX_SAFE_INTEGER).add(1).commit().toRawInternalBigInt()",
          outputs: register(
            "outputs",
            "raw_int_max_safe",
            mapAllOutputs(
              CalcAUD.from(Number.MAX_SAFE_INTEGER).add(1).commit(),
            ),
          ),
        },
      ],
      toMonetary: [
        {
          title: "IOF Cascata (Juros sobre Juros)",
          context: "Principal + Taxa fixa + (Taxa diária * Dias).",
          code:
            "CalcAUD.from(1000).mult(1.0038).add(CalcAUD.from(1000).mult(0.000082).mult(30)).commit(2).toMonetary()",
          outputs: register(
            "outputs",
            "toMonetary_iof",
            mapAllOutputs(
              CalcAUD.from(1000).mult(1.0038).add(
                CalcAUD.from(1000).mult(0.000082).mult(30),
              ).commit(2),
            ),
          ),
        },
      ],
      toLaTeX: [
        {
          title: "Fórmula de Bhaskara (Delta)",
          context: "b² - 4ac",
          code:
            "CalcAUD.from('-5').pow(2).sub(CalcAUD.from(4).mult(1).mult(6)).commit(0).toLaTeX()",
          outputs: register(
            "outputs",
            "latex_bhaskara",
            mapAllOutputs(
              CalcAUD.from("-5").pow(2).sub(CalcAUD.from(4).mult(1).mult(6))
                .commit(0),
            ),
          ),
        },
        {
          title: "Desvio Padrão Amostral",
          context: "Raiz de (SomaQuadrados / (N-1))",
          code: "CalcAUD.from(2500).div(49).pow('1/2').commit(2).toLaTeX()",
          outputs: register(
            "outputs",
            "latex_std_dev",
            mapAllOutputs(
              CalcAUD.from(2500).div(49).pow("1/2").commit(2),
            ),
          ),
        },
      ],
      toHTML: [
        {
          title: "Série de Pagamentos (PMT)",
          context: "Renderização visual da fórmula de Price.",
          code:
            "CalcAUD.from(10000).mult(0.02).div(CalcAUD.from(1).sub(CalcAUD.from(1.02).pow(-12))).commit(2).toHTML()",
          outputs: register(
            "outputs",
            "html_price",
            mapAllOutputs(
              CalcAUD.from(10000).mult(0.02).div(
                CalcAUD.from(1).sub(CalcAUD.from(1.02).pow(-12)),
              ).commit(2),
            ),
          ),
        },
      ],
      toUnicode: [
        {
          title: "Expressão em Texto Puro",
          context: "Raiz e Potência em caracteres Unicode.",
          code:
            "CalcAUD.from(81).pow('1/2').add(CalcAUD.from(2).pow(3)).commit(0).toUnicode()",
          outputs: register(
            "outputs",
            "unicode_roots",
            mapAllOutputs(
              CalcAUD.from(81).pow("1/2").add(CalcAUD.from(2).pow(3)).commit(0),
            ),
          ),
        },
      ],
      toVerbalA11y: [
        {
          title: "Leitura de Fatura Complexa",
          context: "Serviço + (Serviço * Taxa) - (Serviço * Retenção).",
          code: "CalcAUD.from(5000).add(CalcAUD.from(5000).mult(0.05)).sub(CalcAUD.from(5000).mult(0.11)).commit(2).toVerbalA11y()",
          outputs: register("outputs", "verbal_invoice", mapAllOutputs(
            CalcAUD.from(5000).add(CalcAUD.from(5000).mult(0.05)).sub(CalcAUD.from(5000).mult(0.11)).commit(2),
          )),
        },
      ],
      toCustomOutput: [
        {
          title: "Log de Auditoria Interna",
          context: "Geração de log proprietário via processador customizado.",
          code: "CalcAUD.from(100).add(50).commit(2).toCustomOutput(p => `[LOG] ${p.rawData.unicodeExpression}`)",
          outputs: register("outputs", "custom_log", mapAllOutputs(
            CalcAUD.from(100).add(50).commit(2),
          )),
        },
        {
          title: "Exportação para Sistema Legado",
          context: "Mapeamento de valores BigInt e casas decimais.",
          code: "CalcAUD.from(123.45).commit(2).toCustomOutput(p => `ID:123|VAL:${p.rawData.value}|DEC:${p.rawData.decimalPrecision}`)",
          outputs: register("outputs", "custom_legacy", mapAllOutputs(
            CalcAUD.from(123.45).commit(2),
          )),
        },
      ],
      toImageBuffer: [
        {
          title: "Snapshot de Juros Compostos",
          context: "Geração de imagem binária da fórmula.",
          code:
            "CalcAUD.from(1000).mult(CalcAUD.from(1).add('0.05').group().pow(12)).commit(0).toImageBuffer()",
          outputs: register(
            "outputs",
            "image_compound",
            mapAllOutputs(
              CalcAUD.from(1000).mult(
                CalcAUD.from(1).add("0.05").group().pow(12),
              ).commit(0),
            ),
          ),
        },
      ],
      toJson: [
        {
          title: "Exportação Completa",
          context: "Todos os formatos disponíveis.",
          code: "CalcAUD.from(100).add(50).commit(2).toJson()",
          outputs: register(
            "outputs",
            "json_full",
            mapAllOutputs(
              CalcAUD.from(100).add(50).commit(2),
            ),
          ),
        },
      ],
    },
    operations: {
      add: [
        {
          title: "Folha de Pagamento Detalhada",
          context: "Salário + Hora Extra (50%) + DSR + Bônus - Atrasos.",
          code:
            "CalcAUD.from(3000).add(CalcAUD.from(200).mult(1.5)).add(100).add(500).sub(50).commit(2)",
          outputs: register(
            "operations",
            "add_payroll",
            mapAllOutputs(
              CalcAUD.from(3000).add(CalcAUD.from(200).mult(1.5)).add(100).add(
                500,
              ).sub(50).commit(2),
            ),
          ),
        },
        {
          title: "Composição de Preço de Venda",
          context: "Custo + Frete + Embalagem + Margem Fixa.",
          code: "CalcAUD.from(50.00).add(12.50).add(2.30).add(20.00).commit(2)",
          outputs: register(
            "operations",
            "add_price_composition",
            mapAllOutputs(
              CalcAUD.from(50.00).add(12.50).add(2.30).add(20.00).commit(2),
            ),
          ),
        },
      ],
      sub: [
        {
          title: "Apuração de Lucro Líquido Real",
          context: "Receita Bruta - (Impostos + Custos + Despesas).",
          code:
            "CalcAUD.from(100000).sub(CalcAUD.from(100000).mult(0.18)).sub(40000).sub(15000).commit(2)",
          outputs: register(
            "operations",
            "sub_net_profit",
            mapAllOutputs(
              CalcAUD.from(100000).sub(CalcAUD.from(100000).mult(0.18)).sub(
                40000,
              ).sub(15000).commit(2),
            ),
          ),
        },
      ],
      mult: [
        {
          title: "Conversão Cambial Triangulada",
          context: "BRL -> USD -> EUR (com spread de 2% em cada ponta).",
          code:
            "CalcAUD.from(1000).div(5.50).mult(0.98).mult(0.92).mult(0.98).commit(2, {currency: 'EUR'})",
          outputs: register(
            "operations",
            "mult_forex",
            mapAllOutputs(
              CalcAUD.from(1000).div(5.50).mult(0.98).mult(0.92).mult(0.98)
                .commit(2, { currency: "EUR" }),
            ),
          ),
        },
      ],
      div: [
        {
          title: "Cálculo de Parcelas (PMT - Price)",
          context: "Fórmula completa: PV * [ i(1+i)^n ] / [ (1+i)^n - 1 ]",
          code: `
const i = 0.01;
const n = 12;
const num = CalcAUD.from(1000).mult(i).mult(CalcAUD.from(1).add(i).group().pow(n));
const den = CalcAUD.from(1).add(i).group().pow(n).sub(1);
num.div(den.group()).commit(2)`.trim(),
          outputs: register(
            "operations",
            "div_price_full",
            mapAllOutputs(
              CalcAUD.from(1000).mult(0.01).mult(
                CalcAUD.from(1).add(0.01).group().pow(12),
              )
                .div(CalcAUD.from(1).add(0.01).group().pow(12).sub(1).group())
                .commit(2),
            ),
          ),
        },
      ],
      pow: [
        {
          title: "Raiz Cúbica de Volume",
          context: "Lado de um cubo com volume 27m³.",
          code: "CalcAUD.from(27).pow('1/3').commit(2)",
          outputs: register(
            "operations",
            "pow_cube_root",
            mapAllOutputs(
              CalcAUD.from(27).pow("1/3").commit(2),
            ),
          ),
        },
        {
          title: "Juros Compostos (30 anos)",
          context: "Investimento de Longo Prazo: 10k a 8% a.a.",
          code:
            "CalcAUD.from(10000).mult(CalcAUD.from(1.08).pow(30)).commit(2)",
          outputs: register(
            "operations",
            "pow_long_term",
            mapAllOutputs(
              CalcAUD.from(10000).mult(CalcAUD.from(1.08).pow(30)).commit(2),
            ),
          ),
        },
      ],
      mod: [
        {
          title: "Distribuição de Carga",
          context: "5003 itens em caixas de 12. Quantos sobram?",
          code: "CalcAUD.from(5003).mod(12).commit(0)",
          outputs: register(
            "operations",
            "mod_items",
            mapAllOutputs(
              CalcAUD.from(5003).mod(12).commit(0),
            ),
          ),
        },
      ],
      divInt: [
        {
          title: "Cálculo de Caixas Completas",
          context: "5003 itens, cabem 12 por caixa. Quantas caixas?",
          code: "CalcAUD.from(5003).divInt(12).commit(0)",
          outputs: register(
            "operations",
            "divint_boxes",
            mapAllOutputs(
              CalcAUD.from(5003).divInt(12).commit(0),
            ),
          ),
        },
      ],
      group: [
        {
          title: "Média Ponderada com Agrupamento",
          context: "((N1*P1) + (N2*P2)) / (P1+P2)",
          code:
            "CalcAUD.from(8).mult(3).add(CalcAUD.from(6).mult(2)).group().div(CalcAUD.from(3).add(2).group()).commit(2)",
          outputs: register(
            "operations",
            "group_weighted_avg",
            mapAllOutputs(
              CalcAUD.from(8).mult(3).add(CalcAUD.from(6).mult(2)).group().div(
                CalcAUD.from(3).add(2).group(),
              ).commit(2),
            ),
          ),
        },
      ],
    },
  };

  // Log global registry as requested for server-side logging
  console.log(
    "Global Execution Registry:",
    JSON.stringify(globalRegistry, null, 2),
  );

  return examples;
};
