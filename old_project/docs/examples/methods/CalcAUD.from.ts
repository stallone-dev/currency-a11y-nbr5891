/**
 * @title Método: CalcAUD.from()
 * @description Exemplos de como inicializar uma instância CalcAUD a partir de diferentes tipos de entrada.
 * @tags from, initialization, input
 */

import { CalcAUD } from "../../src/main.ts";

function exemploFrom() {
    console.log("--- CalcAUD.from(): Inicialização ---");

    // Exemplo 1: Inicialização a partir de um Number
    // Ideal para valores simples e conhecidos.
    const fromNumber = CalcAUD.from(100);
    console.log(`1. Do Number 100: ${fromNumber.commit(0).toString()}`); // Saída: 100

    // Exemplo 2: Inicialização a partir de uma String Decimal
    // Recomendado para entrada de usuário ou dados de APIs para evitar imprecisão do float.
    const fromStringDecimal = CalcAUD.from("123.456");
    console.log(`2. Da String "123.456": ${fromStringDecimal.commit(3).toString()}`); // Saída: 123.456

    // Exemplo 3: Inicialização a partir de uma String de Fração
    // Útil para matemática precisa, como 1/3.
    const fromStringFraction = CalcAUD.from("1/3");
    console.log(`3. Da String "1/3" (2 casas): ${fromStringFraction.commit(2).toString()}`); // Saída: 0.33
    console.log(`3. Da String "1/3" (6 casas): ${fromStringFraction.commit(6).toString()}`); // Saída: 0.333333

    // Exemplo 4: Inicialização a partir de uma String Científica
    // Para valores muito grandes ou muito pequenos.
    const fromStringScientific = CalcAUD.from("1.23e-5");
    console.log(`4. Da String "1.23e-5": ${fromStringScientific.commit(7).toString()}`); // Saída: 0.0000123

    // Exemplo 5: Inicialização a partir de um BigInt
    // Para uso interno ou integração com outras bibliotecas BigInt.
    const fromBigInt = CalcAUD.from(5000n);
    console.log(`5. Do BigInt 5000n: ${fromBigInt.commit(0).toString()}`); // Saída: 5000

    // Exemplo 6: Inicialização a partir de outra instância CalcAUD
    // Clona a instância, útil para fluxos imutáveis onde o estado precisa ser isolado.
    const original = CalcAUD.from(200);
    const fromCalcAUD = CalcAUD.from(original);
    console.log(`6. De outra instância CalcAUD: ${fromCalcAUD.commit(0).toString()}`); // Saída: 200
    // As duas instâncias são independentes
    fromCalcAUD.add(50);
    console.log(`   Original após modificação da cópia: ${original.commit(0).toString()}`); // Saída: 200 (inalterado)

    // Exemplo 7: Tratamento de entradas inválidas (lança CalcAUDError)
    try {
        CalcAUD.from("abc");
    } catch (e: any) {
        console.log(`7. Erro esperado para "abc": ${e.title}`); // Saída: Erro de Parsing Numérico
    }

    try {
        CalcAUD.from(NaN);
    } catch (e: any) {
        console.log(`8. Erro esperado para NaN: ${e.title}`); // Saída: Tipo de Dado Inválido
    }
}

exemploFrom();
