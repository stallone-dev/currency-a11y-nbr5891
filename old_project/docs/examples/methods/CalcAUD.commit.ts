/**
 * @title Método: CalcAUD.commit()
 * @description Exemplos de como finalizar um cálculo, definindo precisão e opções de arredondamento e localização.
 * @tags commit, output, options
 */

import { CalcAUD } from "../../src/main.ts";

function exemploCommit() {
    console.log("--- CalcAUD.commit(): Finalizando Cálculos ---");

    // Exemplo 1: Commit Padrão (6 casas decimais, NBR-5891, pt-BR)
    const resultadoPadrao = CalcAUD.from("100").div(3);
    const outputPadrao = resultadoPadrao.commit();
    console.log(`1. 100 / 3 (padrão): ${outputPadrao.toString()}`); // Saída: 33.333333

    // Exemplo 2: Commit com Precisão Específica
    const resultadoPrecisao = CalcAUD.from("100").div(3);
    const outputPrecisao = resultadoPrecisao.commit(2); // Apenas 2 casas
    console.log(`2. 100 / 3 (2 casas): ${outputPrecisao.toString()}`); // Saída: 33.33

    // Exemplo 3: Commit com Método de Arredondamento (HALF-UP)
    const valorArredondar = CalcAUD.from("1.235");
    const outputHalfUp = valorArredondar.commit(2, { roundingMethod: "HALF-UP" });
    console.log(`3. 1.235 (HALF-UP): ${outputHalfUp.toString()}`); // Saída: 1.24

    // Exemplo 4: Commit com Método de Arredondamento (NBR-5891 / HALF-EVEN)
    const valorArredondarNBR = CalcAUD.from("1.235");
    const outputNBR = valorArredondarNBR.commit(2, { roundingMethod: "NBR-5891" });
    console.log(`4. 1.235 (NBR-5891): ${outputNBR.toString()}`); // Saída: 1.24 (arredonda para o par mais próximo, 4 é par)

    const valorArredondarNBR2 = CalcAUD.from("1.225");
    const outputNBR2 = valorArredondarNBR2.commit(2, { roundingMethod: "NBR-5891" });
    console.log(`5. 1.225 (NBR-5891): ${outputNBR2.toString()}`); // Saída: 1.22 (arredonda para o par mais próximo, 2 é par)

    // Exemplo 6: Commit com Locale e Currency customizados
    const valorInternacional = CalcAUD.from("1234.567");
    const outputInternacional = valorInternacional.commit(2, { locale: "en-US", currency: "EUR" });
    console.log(`6. 1234.567 (en-US, EUR): ${outputInternacional.toMonetary()}`); // Saída: €1,234.57

    // Exemplo 7: Commit com estratégia de Módulo/Divisão Inteira (apenas para referência na meta)
    const resultadoMod = CalcAUD.from(10).mod(3, "truncated"); // A estratégia é definida no método 'mod'
    const outputMod = resultadoMod.commit(0);
    console.log(`7. 10 mod 3 (Truncated): ${outputMod.toString()}`); // Saída: 1
    // A opção modStrategy passada no commit não afeta o cálculo, apenas é refletida nos metadados de output.
    const outputMetaMod = resultadoMod.commit(0, { modStrategy: "euclidean" });
    console.log(`   Meta do Output: ${JSON.parse(outputMetaMod.toJson()).meta.modStrategy}`); // Saída: euclidean
}

exemploCommit();
