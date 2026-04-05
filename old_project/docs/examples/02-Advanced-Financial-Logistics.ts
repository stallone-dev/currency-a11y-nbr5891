/**
 * @title Exemplo 02: Engenharia Financeira e Logística
 * @description Uso de potências fracionárias para taxas equivalentes e aritmética modular para distribuição.
 * @tags advanced, pow, mod, divInt
 */

import { CalcAUD } from "../../src/main.ts";

// Cenário 1: Conversão de Taxa de Juros (Anual -> Mensal)
// Fórmula: i_mes = (1 + i_ano)^(1/12) - 1
function calcularTaxaEquivalente() {
    console.log("--- Cálculo de Juros Compostos ---");

    const taxaAnual = CalcAUD.from("0.1268"); // 12.68% ao ano
    const base = taxaAnual.add(1); // 1.1268

    // O método .pow aceita frações strings para garantir precisão no expoente
    const fatorMensal = base.pow("1/12");

    const taxaMensal = fatorMensal.sub(1);

    // Commit com alta precisão (6 casas percentuais)
    const output = taxaMensal.commit(6);

    console.log(`Taxa Anual: 12.68%`);
    console.log(`Taxa Mensal Equivalente: ${output.toString()}`); // Esperado: ~0.010000 (1%)
    console.log(`Auditoria: ${output.toUnicode()}`);
}

// Cenário 2: Logística de Distribuição (Divisão Inteira e Resto)
// Distribuir 10.000 unidades em contêineres de 144 unidades.
function calcularLogistica() {
    console.log("\n--- Cálculo Logístico ---");

    const totalItens = CalcAUD.from(10000);
    const capacidadeContainer = CalcAUD.from(144);

    // Quantos contêineres cheios?
    // Usamos 'truncated' pois não faz sentido "piso negativo" em logística física
    const conteineresCheios = totalItens.divInt(capacidadeContainer, { modStrategy: "truncated" });

    // Quantos itens sobram para o LCL (Less than Container Load)?
    const sobra = totalItens.mod(capacidadeContainer, { modStrategy: "truncated" });

    const outputCheios = conteineresCheios.commit(0);
    const outputSobra = sobra.commit(0);

    console.log(`Total de Itens: 10.000`);
    console.log(`Capacidade por Contêiner: 144`);
    console.log(`Contêineres Cheios: ${outputCheios.toString()}`);
    console.log(`Itens na Sobra: ${outputSobra.toString()}`);

    console.log(`Explicação Verbal: ${outputCheios.toVerbalA11y()}`);
    // Ex: "10000 dividido por 144, truncado ao inteiro é igual a 69..."
}

calcularTaxaEquivalente();
calcularLogistica();
