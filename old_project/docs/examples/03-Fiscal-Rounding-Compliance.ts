/**
 * @title Exemplo 03: Compliance Fiscal e Arredondamento
 * @description Comparativo entre normas de arredondamento (ABNT NBR 5891 vs Padrão Escolar) e localização.
 * @tags fiscal, rounding, options
 */

import { CalcAUD } from "../../src/main.ts";

function demonstrarArredondamento() {
    console.log("--- Cenário: O Caso do 0.5 ---");
    // O valor 2.50 centavos deve ser arredondado para inteiro (ex: impostos em ienes ou pesos).
    // Qual a regra?

    const valorCritico = CalcAUD.from("2.50");

    // 1. Regra "Escolar" (HALF-UP)
    // Usada em comércio varejista simples. 2.5 -> 3
    const outputSchool = valorCritico.commit(0, { roundingMethod: "HALF-UP" });
    console.log(`HALF-UP (Escolar): ${outputSchool.toString()}`);

    // 2. Regra ABNT / Bancária (NBR-5891 / HALF-EVEN)
    // Usada em balanços contábeis para evitar viés estatístico.
    // 2.5 -> 2 (Vai para o par mais próximo)
    const outputBanker = valorCritico.commit(0, { roundingMethod: "NBR-5891" });
    console.log(`NBR-5891 (Bancário): ${outputBanker.toString()}`);

    console.log("\n--- Cenário: Localização Internacional ---");

    const valorGrande = CalcAUD.from("1234567.89");

    // Brasil: Ponto milhar, Vírgula decimal, BRL
    const outBR = valorGrande.commit(2, { locale: "pt-BR" });
    console.log(`Brasil: ${outBR.toMonetary()}`);

    // EUA: Vírgula milhar, Ponto decimal, USD
    const outUS = valorGrande.commit(2, { locale: "en-US" });
    console.log(`EUA:    ${outUS.toMonetary()}`);

    // Alemanha: Ponto milhar, Vírgula decimal, EUR
    const outDE = valorGrande.commit(2, { locale: "en-EU" }); // en-EU usa EUR como default
    console.log(`Europa: ${outDE.toMonetary()}`);

    // Híbrido: Texto em Português, Moeda Japonesa
    const outJP = valorGrande.commit(0, { locale: "pt-BR", currency: "JPY" });
    console.log(`Japão (Formatado BR): ${outJP.toMonetary()}`);
    // Saída esperada: "JPY 1.234.568" (arredondado para 0 casas)
}

demonstrarArredondamento();
