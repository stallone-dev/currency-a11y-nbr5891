import { mapAllOutputs } from "../logic/mapper.ts";
import { CalcAUD } from "@calc-aud-nbr-a11y";

export const getCategorizedExamples = () => {
  return {
    outputs: {
      verbalMonetary: [
        {
          title: "Locale PT-BR",
          context: "Valor: 1501.25",
          code:
            "CalcAUD.from('1500.50').add(0.75).commit(2, { locale: 'pt-BR' })",
          outputs: mapAllOutputs(
            CalcAUD.from("1500.50").add(0.75).commit(2, {
              locale: "pt-BR",
            }),
          ),
        },
        {
          title: "Locale FR-FR",
          context: "Valor: 1501.25",
          code:
            "CalcAUD.from('1500.50').add(0.75).commit(2, { locale: 'fr-FR' })",
          outputs: mapAllOutputs(
            CalcAUD.from("1500.50").add(0.75).commit(2, {
              locale: "fr-FR",
            }),
          ),
        },
        {
          title: "Locale JA-JP",
          context: "Valor: 1501.25",
          code:
            "CalcAUD.from('1500.50').add(0.75).commit(2, { locale: 'ja-JP' })",
          outputs: mapAllOutputs(
            CalcAUD.from("1500.50").add(0.75).commit(2, {
              locale: "ja-JP",
            }),
          ),
        },
        {
          title: "Locale ru-RU",
          context: "Soma de BRL convertida (Simulada)",
          code:
            "CalcAUD.from(100).add(50).mult(5.5).commit(2, { locale: 'ru-RU' })",
          outputs: mapAllOutputs(
            CalcAUD.from("1500.50").add(0.75).commit(2, {
              locale: "ru-RU",
            }),
          ),
        },
      ],
      roundingShowcase: [
        {
          title: "NBR-5891 (Padrão)",
          context: "Arredonda 2.5 para Par (2)",
          code: "CalcAUD.from(2.5).commit(0, { roundingMethod: 'NBR-5891' })",
          outputs: mapAllOutputs(
            CalcAUD.from(2.5).commit(0, { roundingMethod: "NBR-5891" }),
          ),
        },
        {
          title: "HALF-UP",
          context: "Arredonda 2.5 para Cima (3)",
          code: "CalcAUD.from(2.5).commit(0, { roundingMethod: 'HALF-UP' })",
          outputs: mapAllOutputs(
            CalcAUD.from(2.5).commit(0, { roundingMethod: "HALF-UP" }),
          ),
        },
        {
          title: "TRUNCATE",
          context: "Trunca 2.9 para 2",
          code: "CalcAUD.from(2.9).commit(0, { roundingMethod: 'TRUNCATE' })",
          outputs: mapAllOutputs(
            CalcAUD.from(2.9).commit(0, { roundingMethod: "TRUNCATE" }),
          ),
        },
        {
          title: "CEIL",
          context: "Arredondamento para cima 2.9 para 2",
          code:
            "CalcAUD.from('5.12345').mult(1000).div(3).commit(2, { roundingMethod: 'CEIL' })",
          outputs: mapAllOutputs(
            CalcAUD.from(2.1).commit(0, { roundingMethod: "CEIL" }),
          ),
        },
      ],
      toString: [
        {
          title: "Arredondamento ABNT (Par)",
          context: "Valor: 1.225",
          code: "CalcAUD.from('1.225').commit(2).toString()",
          outputs: mapAllOutputs(CalcAUD.from("1.225").commit(2)),
        },
        {
          title: "Grande Escala",
          context: "Valor: 999.999.999,99",
          code: "CalcAUD.from('999999999.99').commit(2).toString()",
          outputs: mapAllOutputs(CalcAUD.from("999999999.99").commit(2)),
        },
        {
          title: "Cadeia de Soma",
          context: "Valores: 0.1, 0.2, 0.3",
          code:
            "CalcAUD.from('0.1').add('0.2').add('0.3').commit(2).toString()",
          outputs: mapAllOutputs(
            CalcAUD.from("0.1").add("0.2").add("0.3").commit(2),
          ),
        },
        {
          title: "Expressão Algébrica",
          context: "Resultado de (A + B) * C",
          code:
            "CalcAUD.from(10).add(20).group().mult(5.5).commit(3).toString()",
          outputs: mapAllOutputs(
            CalcAUD.from(10).add(20).group().mult(5.5).commit(3),
          ),
        },
      ],
      toFloatNumber: [
        {
          title: "Precisão Decimal",
          context: "Valor: 1/3",
          code: "CalcAUD.from(1).div(3).commit(10).toFloatNumber()",
          outputs: mapAllOutputs(CalcAUD.from(1).div(3).commit(10)),
        },
        {
          title: "Valor Inteiro",
          context: "Valor: 1000",
          code: "CalcAUD.from(1000).commit().toFloatNumber()",
          outputs: mapAllOutputs(CalcAUD.from(1000).commit()),
        },
        {
          title: "Pequeno Negativo",
          context: "Valor: -0.005",
          code: "CalcAUD.from('-0.005').commit(3).toFloatNumber()",
          outputs: mapAllOutputs(CalcAUD.from("-0.005").commit(3)),
        },
        {
          title: "Fluxo de Caixa Descontado",
          context: "VP = VF / (1+i)^n",
          code:
            "CalcAUD.from(1000).div(CalcAUD.from(1.1).pow(5)).commit(2).toFloatNumber()",
          outputs: mapAllOutputs(
            CalcAUD.from(1000).div(CalcAUD.from(1.1).pow(5)).commit(2),
          ),
        },
      ],
      toRawInternalBigInt: [
        {
          title: "Escala Interna (10^12)",
          context: "Valor: 1.00",
          code: "CalcAUD.from(1).commit().toRawInternalBigInt()",
          outputs: mapAllOutputs(CalcAUD.from(1).commit()),
        },
        {
          title: "Precisão de 12 casas",
          context: "Valor: 0.000000000001",
          code: "CalcAUD.from('0.000000000001').commit().toRawInternalBigInt()",
          outputs: mapAllOutputs(CalcAUD.from("0.000000000001").commit()),
        },
        {
          title: "Limite Seguro",
          context: "Valor: 2^53 - 1",
          code:
            "CalcAUD.from(Number.MAX_SAFE_INTEGER).commit().toRawInternalBigInt()",
          outputs: mapAllOutputs(
            CalcAUD.from(Number.MAX_SAFE_INTEGER).commit(),
          ),
        },
        {
          title: "Volume de Transações",
          context: "Soma de grandes volumes",
          code:
            "CalcAUD.from(1e9).mult(1e5).add(0.01).commit().toRawInternalBigInt()",
          outputs: mapAllOutputs(
            CalcAUD.from(1e9).mult(1e5).add(0.01).commit(),
          ),
        },
      ],
      toMonetary: [
        {
          title: "Real Brasileiro (Padrão)",
          context: "Valor: 1234.56",
          code:
            "CalcAUD.from('1234.56').commit(2, { locale: 'pt-BR' }).toMonetary()",
          outputs: mapAllOutputs(
            CalcAUD.from("1234.56").commit(2, { locale: "pt-BR" }),
          ),
        },
        {
          title: "Dólar Americano",
          context: "Valor: 1234.56",
          code:
            "CalcAUD.from('1234.56').commit(2, { locale: 'en-US' }).toMonetary()",
          outputs: mapAllOutputs(
            CalcAUD.from("1234.56").commit(2, { locale: "en-US" }),
          ),
        },
        {
          title: "Euro com 4 casas",
          context: "Valor: 1.2345",
          code:
            "CalcAUD.from('1.2345').commit(4, { locale: 'fr-FR' }).toMonetary()",
          outputs: mapAllOutputs(
            CalcAUD.from("1.2345").commit(4, { locale: "fr-FR" }),
          ),
        },
        {
          title: "IOF em Cadeia",
          context: "Principal + IOF (0.38% + 0.0082% dia)",
          code:
            "CalcAUD.from(1000).mult(1.0038).add(CalcAUD.from(1000).mult(0.000082).mult(30)).commit(2).toMonetary()",
          outputs: mapAllOutputs(
            CalcAUD.from(1000).mult(1.0038).add(
              CalcAUD.from(1000).mult(0.000082).mult(30),
            ).commit(
              2,
            ),
          ),
        },
      ],
      toLaTeX: [
        {
          title: "Fração Simples",
          context: "Valores: 100 / 3",
          code: "CalcAUD.from(100).div(3).commit(0).toLaTeX()",
          outputs: mapAllOutputs(CalcAUD.from(100).div(3).commit(0)),
        },
        {
          title: "Raiz Quadrada",
          context: "Valores: √81",
          code: "CalcAUD.from(81).pow('1/2').commit(0).toLaTeX()",
          outputs: mapAllOutputs(CalcAUD.from(81).pow("1/2").commit(0)),
        },
        {
          title: "Potência e Grupo",
          context: "Valores: (2 + 3)^2",
          code: "CalcAUD.from(2).add(3).group().pow(2).commit(0).toLaTeX()",
          outputs: mapAllOutputs(
            CalcAUD.from(2).add(3).group().pow(2).commit(0),
          ),
        },
        {
          title: "Desvio Padrão (Amostra)",
          context: "Raiz da Variância",
          code: "CalcAUD.from(2500).div(50).pow('1/2').commit(0).toLaTeX()",
          outputs: mapAllOutputs(
            CalcAUD.from(2500).div(50).pow("1/2").commit(0),
          ),
        },
      ],
      toHTML: [
        {
          title: "Renderização SSR KaTeX",
          context: "Valor: 10.50 * 2",
          code: "CalcAUD.from('10.5').mult(2).commit(0).toHTML()",
          outputs: mapAllOutputs(CalcAUD.from("10.5").mult(2).commit(0)),
        },
        {
          title: "Baskhara (Fragmento)",
          context: "delta = (-5)^2 - 4*1*6",
          code:
            "CalcAUD.from('-5').pow(2).sub(CalcAUD.from(4).mult(1).mult(6)).commit(0).toHTML()",
          outputs: mapAllOutputs(
            CalcAUD.from("-5").pow(2).sub(
              CalcAUD.from(4).mult(1).mult(6),
            ).commit(0),
          ),
        },
        {
          title: "Divisões Aninhadas",
          context: "100 / (10 / 2)",
          code:
            "CalcAUD.from(100).div(CalcAUD.from(10).div(2).group()).commit(0).toHTML()",
          outputs: mapAllOutputs(
            CalcAUD.from(100).div(CalcAUD.from(10).div(2).group())
              .commit(0),
          ),
        },
        {
          title: "Série de Pagamentos",
          context: "PMT = PV * i / (1 - (1+i)^-n)",
          code:
            "CalcAUD.from(10000).mult(0.02).div(CalcAUD.from(1).sub(CalcAUD.from(1.02).pow(-12))).commit(2).toHTML()",
          outputs: mapAllOutputs(
            CalcAUD.from(10000).mult(0.02).div(
              CalcAUD.from(1).sub(CalcAUD.from(1.02).pow(-12)),
            )
              .commit(2),
          ),
        },
      ],
      toUnicode: [
        {
          title: "CLI Simples",
          context: "10 + 5 * 2",
          code: "CalcAUD.from(10).add(5).mult(2).commit(0).toUnicode()",
          outputs: mapAllOutputs(CalcAUD.from(10).add(5).mult(2).commit(0)),
        },
        {
          title: "Sobrescrito e Raiz",
          context: "√(81) + 2³",
          code:
            "CalcAUD.from(81).pow('1/2').add(CalcAUD.from(2).pow(3)).commit(0).toUnicode()",
          outputs: mapAllOutputs(
            CalcAUD.from(81).pow("1/2").add(CalcAUD.from(2).pow(3))
              .commit(0),
          ),
        },
        {
          title: "Divisão Unicode",
          context: "100 ÷ 4",
          code: "CalcAUD.from(100).div(4).commit(0).toUnicode()",
          outputs: mapAllOutputs(CalcAUD.from(100).div(4).commit(0)),
        },
        {
          title: "Fórmula de Bhaskara Completa",
          context: "(-b + √Δ) / 2a",
          code:
            "CalcAUD.from(-10).add(CalcAUD.from(100).sub(4).group().pow('1/2')).div(2).commit(0).toUnicode()",
          outputs: mapAllOutputs(
            CalcAUD.from(-10).add(
              CalcAUD.from(100).sub(4).group().pow("1/2"),
            ).div(2).commit(0),
          ),
        },
      ],
      toVerbalA11y: [
        {
          title: "Narração de Grupo",
          context: "(10 + 20) * 2",
          code:
            "CalcAUD.from(10).add(20).group().mult(2).commit(0).toVerbalA11y()",
          outputs: mapAllOutputs(
            CalcAUD.from(10).add(20).group().mult(2).commit(0),
          ),
        },
        {
          title: "Narração de Raiz Cúbica",
          context: "³√8",
          code: "CalcAUD.from(8).pow('1/3').commit(0).toVerbalA11y()",
          outputs: mapAllOutputs(CalcAUD.from(8).pow("1/3").commit(0)),
        },
        {
          title: "Cenário de Desconto",
          context: "1000 - 15%",
          code:
            "CalcAUD.from(1000).sub(CalcAUD.from(1000).mult('0.15').group()).commit(0).toVerbalA11y()",
          outputs: mapAllOutputs(
            CalcAUD.from(1000).sub(
              CalcAUD.from(1000).mult("0.15").group(),
            ).commit(0),
          ),
        },
        {
          title: "Fatura Complexa",
          context: "Serviço + Imposto - Retenção",
          code:
            "CalcAUD.from(5000).add(CalcAUD.from(5000).mult(0.05)).sub(CalcAUD.from(5000).mult(0.11)).commit(2).toVerbalA11y()",
          outputs: mapAllOutputs(
            CalcAUD.from(5000).add(CalcAUD.from(5000).mult(0.05)).sub(
              CalcAUD.from(5000).mult(0.11),
            ).commit(2),
          ),
        },
      ],
      toImageBuffer: [
        {
          title: "Snapshot Visual",
          context: "Fórmula SAC",
          code: "CalcAUD.from(200000).div(100).commit(0).toImageBuffer()",
          outputs: mapAllOutputs(CalcAUD.from(200000).div(100).commit(0)),
        },
        {
          title: "Auditabilidade em Imagem",
          context: "Juros Compostos",
          code:
            "CalcAUD.from(1000).mult(CalcAUD.from(1).add('0.05').group().pow(12)).commit(0).toImageBuffer()",
          outputs: mapAllOutputs(
            CalcAUD.from(1000).mult(
              CalcAUD.from(1).add("0.05").group().pow(12),
            ).commit(0),
          ),
        },
        {
          title: "Raiz Positiva",
          context: "√delta / (2*a)",
          code:
            "CalcAUD.from(1).pow('1/2').div(CalcAUD.from(2).mult(1).group()).commit(0).toImageBuffer()",
          outputs: mapAllOutputs(
            CalcAUD.from(1).pow("1/2").div(
              CalcAUD.from(2).mult(1).group(),
            ).commit(0),
          ),
        },
        {
          title: "Relatório Consolidado",
          context: "Margem de Lucro: (Venda - Custo) / Venda",
          code:
            "CalcAUD.from(150).sub(100).group().div(150).mult(100).commit(2).toImageBuffer()",
          outputs: mapAllOutputs(
            CalcAUD.from(150).sub(100).group().div(150).mult(100).commit(2),
          ),
        },
      ],
      toJson: [
        {
          title: "Exportação Completa",
          context: "Resumo de Cálculo",
          code: "CalcAUD.from(100).add(50).commit(2).toJson()",
          outputs: mapAllOutputs(CalcAUD.from(100).add(50).commit(2)),
        },
        {
          title: "Exportação Seletiva",
          context: "Apenas String e LaTeX",
          code:
            "CalcAUD.from(100).add(50).commit(2).toJson(['toString', 'toLaTeX'])",
          outputs: {
            ...mapAllOutputs(CalcAUD.from(100).add(50).commit(2)),
            toJson: CalcAUD.from(100).add(50).commit(2).toJson([
              "toString",
              "toLaTeX",
            ]),
          },
        },
        {
          title: "Apenas toString",
          context: "Output Mínimo",
          code: "CalcAUD.from(123.456).commit(2).toJson(['toString'])",
          outputs: {
            ...mapAllOutputs(CalcAUD.from(123.456).commit(2)),
            toJson: CalcAUD.from(123.456).commit(2).toJson(["toString"]),
          },
        },
        {
          title: "Auditoria de Empréstimo",
          context: "Parcela Price",
          code:
            "CalcAUD.from(1000).mult(0.01).div(CalcAUD.from(1).sub(CalcAUD.from(1.01).pow(-12))).commit(2).toJson()",
          outputs: {
            ...mapAllOutputs(
              CalcAUD.from(1000).mult(0.01).div(
                CalcAUD.from(1).sub(CalcAUD.from(1.01).pow(-12)),
              ).commit(2),
            ),
            toJson: CalcAUD.from(1000).mult(0.01).div(
              CalcAUD.from(1).sub(CalcAUD.from(1.01).pow(-12)),
            ).commit(2).toJson(),
          },
        },
      ],
    },
    operations: {
      add: [
        {
          title: "Adição Simples",
          context: "Soma básica",
          code: "CalcAUD.from(10).add(5).commit(2)",
          outputs: mapAllOutputs(CalcAUD.from(10).add(5).commit(2)),
        },
        {
          title: "Adição Complexa",
          context: "Múltiplos decimais",
          code: "CalcAUD.from(123.45).add(678.90).add(10.11).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(123.45).add(678.90).add(10.11).commit(2),
          ),
        },
        {
          title: "Subtotal de NF",
          context: "Soma de itens com impostos embutidos",
          code:
            "CalcAUD.from('1540.20').add('120.50').add('45.15').add('10.00').commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from("1540.20").add("120.50").add("45.15").add("10.00")
              .commit(2),
          ),
        },
        {
          title: "Folha de Pagamento",
          context: "Salário Base + Hora Extra + DSR + Bônus",
          code:
            "CalcAUD.from(3000).add(500).add(100).add(CalcAUD.from(3000).mult(0.1)).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(3000).add(500).add(100).add(
              CalcAUD.from(3000).mult(0.1),
            ).commit(2),
          ),
        },
      ],
      sub: [
        {
          title: "Subtração Simples",
          context: "Dedução básica",
          code: "CalcAUD.from(100).sub(10).commit(2)",
          outputs: mapAllOutputs(CalcAUD.from(100).sub(10).commit(2)),
        },
        {
          title: "Subtração em Cadeia",
          context: "Múltiplas deduções",
          code: "CalcAUD.from(5000).sub(1234.56).sub(456.78).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(5000).sub(1234.56).sub(456.78).commit(2),
          ),
        },
        {
          title: "Saldo Líquido",
          context: "Bruto - Descontos - Retenções",
          code: "CalcAUD.from(10000).sub(1500).sub(2250).sub(380).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(10000).sub(1500).sub(2250).sub(380).commit(2),
          ),
        },
        {
          title: "Apuração de Lucro Real",
          context: "Receita - CMV - Despesas Op. - Impostos",
          code:
            "CalcAUD.from(50000).sub(20000).sub(15000).sub(CalcAUD.from(50000).sub(20000).sub(15000).group().mult(0.15)).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(50000).sub(20000).sub(15000).sub(
              CalcAUD.from(50000).sub(20000).sub(15000).group().mult(0.15),
            ).commit(2),
          ),
        },
      ],
      mult: [
        {
          title: "Multiplicação Simples",
          context: "Fator fixo",
          code: "CalcAUD.from(10).mult(2).commit(2)",
          outputs: mapAllOutputs(CalcAUD.from(10).mult(2).commit(2)),
        },
        {
          title: "Multiplicação com Precisão",
          context: "Taxa com 4 decimais",
          code: "CalcAUD.from(15.75).mult(4.5).commit(4)",
          outputs: mapAllOutputs(CalcAUD.from(15.75).mult(4.5).commit(4)),
        },
        {
          title: "Cálculo de Juros Simples",
          context: "Principal * Taxa * Tempo (P * i * n)",
          code: "CalcAUD.from(5000).mult(0.015).mult(12).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(5000).mult(0.015).mult(12).commit(2),
          ),
        },
        {
          title: "Conversão Cambial Cruzada",
          context: "USD -> EUR -> BRL (com spread)",
          code: "CalcAUD.from(100).mult(0.92).mult(5.50).mult(1.02).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(100).mult(0.92).mult(5.50).mult(1.02).commit(2),
          ),
        },
      ],
      div: [
        {
          title: "Divisão Simples",
          context: "Divisão básica",
          code: "CalcAUD.from(10).div(2).commit(2)",
          outputs: mapAllOutputs(CalcAUD.from(10).div(2).commit(2)),
        },
        {
          title: "Divisão com Arredondamento",
          context: "10 / 3 com 4 casas",
          code: "CalcAUD.from(10).div(3).commit(4)",
          outputs: mapAllOutputs(CalcAUD.from(10).div(3).commit(4)),
        },
        {
          title: "Rateio de Custos",
          context: "Total / Participantes",
          code: "CalcAUD.from(1000).div(3).commit(2)",
          outputs: mapAllOutputs(CalcAUD.from(1000).div(3).commit(2)),
        },
      ],
      pow: [
        {
          title: "Potência Inteira",
          context: "Exponenciação básica",
          code: "CalcAUD.from(10).pow(2).commit(0)",
          outputs: mapAllOutputs(CalcAUD.from(10).pow(2).commit(0)),
        },
        {
          title: "Fator de Juros",
          context: "1.05 elevado a 12 meses",
          code: "CalcAUD.from(1.05).pow(12).commit(6)",
          outputs: mapAllOutputs(CalcAUD.from(1.05).pow(12).commit(6)),
        },
        {
          title: "Juros Compostos",
          context: "Montante final: P * (1 + i)^n",
          code:
            "CalcAUD.from(1000).mult(CalcAUD.from(1).add(0.005).group().pow(360)).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(1000).mult(
              CalcAUD.from(1).add(0.005).group().pow(360),
            ).commit(2),
          ),
        },
        {
          title: "Valor Futuro de Anuidade",
          context: "Fator (1+i)^n - 1",
          code: "CalcAUD.from(1.01).pow(24).sub(1).commit(8)",
          outputs: mapAllOutputs(
            CalcAUD.from(1.01).pow(24).sub(1).commit(8),
          ),
        },
      ],
      mod: [
        {
          title: "Módulo Simples",
          context: "Resto básico",
          code: "CalcAUD.from(10).mod(3).commit(2)",
          outputs: mapAllOutputs(CalcAUD.from(10).mod(3).commit(2)),
        },
        {
          title: "Resto Decimal",
          context: "Resto de valor quebrado",
          code: "CalcAUD.from(123.45).mod(10).commit(2)",
          outputs: mapAllOutputs(CalcAUD.from(123.45).mod(10).commit(2)),
        },
        {
          title: "Resíduo de Rateio",
          context: "Centavos restantes de 100,00 por 3 pessoas",
          code: "CalcAUD.from(100).mod(3).commit(2)",
          outputs: mapAllOutputs(CalcAUD.from(100).mod(3).commit(2)),
        },
        {
          title: "Distribuição de Dividendos",
          context: "Resto da divisão de lucro por acionistas",
          code: "CalcAUD.from(1000000.55).mod(3500).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(1000000.55).mod(3500).commit(2),
          ),
        },
      ],
      divInt: [
        {
          title: "Divisão Inteira",
          context: "Quociente inteiro",
          code: "CalcAUD.from(10).divInt(3).commit(0)",
          outputs: mapAllOutputs(CalcAUD.from(10).divInt(3).commit(0)),
        },
        {
          title: "Divisão de Grande Valor",
          context: "Itens que cabem no lote",
          code: "CalcAUD.from(5000).divInt(12).commit(0)",
          outputs: mapAllOutputs(CalcAUD.from(5000).divInt(12).commit(0)),
        },
        {
          title: "Amortização de Parcelas",
          context: "Quantidade de parcelas fixas",
          code:
            "CalcAUD.from(CalcAUD.from(1000).sub(100).group()).divInt(12).commit(0)",
          outputs: mapAllOutputs(
            CalcAUD.from(CalcAUD.from(1000).sub(100).group()).divInt(12)
              .commit(0),
          ),
        },
        {
          title: "Lotes de Produção",
          context: "Total MP / Consumo Unitário",
          code: "CalcAUD.from(5000.5).divInt(1.25).commit(0)",
          outputs: mapAllOutputs(
            CalcAUD.from(5000.5).divInt(1.25).commit(0),
          ),
        },
      ],
      group: [
        {
          title: "Precedência Simples",
          context: "(1 + 2) * 3",
          code: "CalcAUD.from(1).add(2).group().mult(3).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(1).add(2).group().mult(3).commit(2),
          ),
        },
        {
          title: "Grupos Aninhados",
          context: "(100 - 10) / (2 + 3)",
          code:
            "CalcAUD.from(100).sub(10).group().div(CalcAUD.from(2).add(3).group()).commit(2)",
          outputs: mapAllOutputs(
            CalcAUD.from(100).sub(10).group().div(
              CalcAUD.from(2).add(3).group(),
            ).commit(2),
          ),
        },
        {
          title: "Fator de Price",
          context: "Fragmento da fórmula de amortização",
          code:
            "CalcAUD.from(1.01).pow(12).div(CalcAUD.from(1.01).pow(12).sub(1).group()).commit(10)",
          outputs: mapAllOutputs(
            CalcAUD.from(1.01).pow(12).div(
              CalcAUD.from(1.01).pow(12).sub(1).group(),
            ).commit(10),
          ),
        },
        {
          title: "Índice de Sharpe",
          context: "(Rp - Rf) / Op",
          code: "CalcAUD.from(0.12).sub(0.05).group().div(0.15).commit(4)",
          outputs: mapAllOutputs(
            CalcAUD.from(0.12).sub(0.05).group().div(0.15).commit(4),
          ),
        },
      ],
    },
  };
};
