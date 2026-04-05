/**
 * @title Método: CalcAUDOutput.toString()
 * @description Exemplos de como obter a representação em string formatada e arredondada de um valor.
 * @tags toString, output, formatting
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToString() {
    console.log("--- CalcAUDOutput.toString(): String Formatada ---");

    // Exemplo 1: Arredondamento padrão (DEFAULT_DISPLAY_PRECISION = 6)
    const calc = CalcAUD.from(10).div(3); // 3.333333333333
    const output = calc.commit();
    console.log(`1. 10 / 3 (padrão): ${output.toString()}`); // Saída: 3.333333

    // Exemplo 2: Precisão específica (2 casas decimais)
    const output2 = calc.commit(2);
    console.log(`2. 10 / 3 (2 casas): ${output2.toString()}`); // Saída: 3.33

    // Exemplo 3: Arredondamento NBR-5891 com "meio"
    // 1.235 arredondado para 2 casas pela NBR-5891 (para o par mais próximo)
    const valorNBR = CalcAUD.from("1.235");
    const outputNBR = valorNBR.commit(2, { roundingMethod: "NBR-5891" });
    console.log(`3. 1.235 (NBR-5891, 2 casas): ${outputNBR.toString()}`); // Saída: 1.24 (pois 4 é par)

    // Exemplo 4: Arredondamento HALF-UP com "meio"
    // 1.235 arredondado para 2 casas pela HALF-UP (para cima)
    const valorHalfUp = CalcAUD.from("1.235");
    const outputHalfUp = valorHalfUp.commit(2, { roundingMethod: "HALF-UP" });
    console.log(`4. 1.235 (HALF-UP, 2 casas): ${outputHalfUp.toString()}`); // Saída: 1.24

    // Exemplo 5: Valor negativo com arredondamento
    const valorNegativo = CalcAUD.from("-100").div(3); // -33.333333
    const outputNegativo = valorNegativo.commit(2);
    console.log(`5. -100 / 3 (2 casas): ${outputNegativo.toString()}`); // Saída: -33.33
}

exemploToString();
