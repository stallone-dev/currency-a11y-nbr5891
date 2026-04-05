/**
 * @title Exemplo 06: Integração com Sistemas Legados (Strategy Pattern)
 * @description Demonstra o uso de `toCustomOutput` para gerar um formato de texto de largura fixa,
 *              comum em integrações com mainframes ou sistemas bancários antigos (COBOL Copybook).
 * @tags custom, strategy, integration, legacy
 */

import { CalcAUD } from "../../src/main.ts";
import type { ICalcAUDCustomOutput } from "../../src/output_helpers/custom_formatter.ts";

// Cenário: Uma transação financeira precisa ser enviada para um core banking em um
// formato de texto de largura fixa (flat file), onde cada caractere tem uma posição e significado.
// Formato: [Tipo: 1 char][Valor em centavos: 15 chars, preenchido com zeros à esquerda][Moeda: 3 chars]
// Ex: "C00000000012345BRL" (Crédito de R$ 123,45)

// 1. Implementação do Processador Customizado (Strategy)
// A função implementa a interface ICalcAUDCustomOutput<string>
const legacyBankingEncoder: ICalcAUDCustomOutput<string> = function (ctx) {
    // 'this' é a instância de CalcAUDOutput, podemos chamar seus métodos
    // 'ctx' contém os dados brutos e acesso aos métodos.

    // Decidimos se a transação é crédito ou débito
    const tipo = this.toCentsInBigInt() >= 0n ? "C" : "D";

    // Pegamos o valor absoluto em centavos
    const centavosAbsolutos = tipo === "C" ? this.toCentsInBigInt() : -this.toCentsInBigInt();

    // Formatamos o valor com preenchimento de zeros à esquerda
    const valorFormatado = centavosAbsolutos.toString().padStart(15, "0");

    // Pegamos a moeda das opções
    const moedaFormatada = ctx.rawData.options.currency.padEnd(3, " ");

    return `${tipo}${valorFormatado}${moedaFormatada}`;
};

function integrarComLegado() {
    console.log("--- Integração com Core Banking (Formato Fixo) ---");

    const transacao = CalcAUD.from("9876.54");

    const output = transacao.commit(2, { currency: "USD" });

    // 2. Executando a Saída Customizada
    const linhaArquivo = output.toCustomOutput(legacyBankingEncoder);

    console.log("Linha gerada para o arquivo de lote:");
    console.log(linhaArquivo); // Saída esperada: C000000000987654USD

    // Demonstração com valor negativo
    const estorno = CalcAUD.from("-100").commit(2);
    const linhaEstorno = estorno.toCustomOutput(legacyBankingEncoder);
    console.log("Linha de estorno:");
    console.log(linhaEstorno); // Saída esperada: D000000000010000BRL
}

integrarComLegado();
