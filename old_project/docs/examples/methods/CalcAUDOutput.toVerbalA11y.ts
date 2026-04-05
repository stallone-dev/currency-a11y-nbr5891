/**
 * @title Método: CalcAUDOutput.toVerbalA11y()
 * @description Exemplos de como gerar descrições verbais para acessibilidade (leitores de tela), em diferentes idiomas.
 * @tags toVerbalA11y, output, a11y, i18n
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToVerbalA11y() {
    console.log("--- CalcAUDOutput.toVerbalA11y(): Descrições Verbais para Acessibilidade ---");

    // Exemplo 1: Operação Básica em Português (padrão)
    const calcPT = CalcAUD.from(10).add(5).mult(2);
    const outputPT = calcPT.commit(0);
    console.log(`1. Pt-BR: ${outputPT.toVerbalA11y()}`);
    // Saída: 10 mais 5 multiplicado por 2 é igual a 20 (Arredondamento: NBR-5891)

    // Exemplo 2: Operação Complexa com Agrupamento em Inglês (en-US)
    const calcEN = CalcAUD.from(100).sub(CalcAUD.from(10).div(3).group()).add(2);
    const outputEN = calcEN.commit(2, { locale: "en-US" });
    console.log(`2. En-US: ${outputEN.toVerbalA11y()}`);
    // Saída: 100 minus grouped, 10 divided by 3, end of group plus 2 equals 98.67 (Rounding: NBR-5891)

    // Exemplo 3: Raiz Cúbica em Japonês (ja-JP)
    const calcJP = CalcAUD.from(27).pow("1/3");
    const outputJP = calcJP.commit(0, { locale: "ja-JP" });
    console.log(`3. Ja-JP: ${outputJP.toVerbalA11y()}`);
    // Saída: 根指数 3 の 27 の 乗根 は 3 (丸め: NBR-5891) (Approximado)

    // Exemplo 4: Divisão Inteira Euclidiana em Espanhol (es-ES)
    const calcES = CalcAUD.from(-10).divInt(3);
    const outputES = calcES.commit(0, { locale: "es-ES" });
    console.log(`4. Es-ES (Euclidiana): ${outputES.toVerbalA11y()}`);
    // Saída: -10 dividido por 3, con piso al entero es igual a -4 (Redondeo: NBR-5891)

    // Exemplo 5: Módulo Truncado em Francês (fr-FR)
    const calcFR = CalcAUD.from(-10).mod(3, "truncated");
    const outputFR = calcFR.commit(0, { locale: "fr-FR" });
    console.log(`5. Fr-FR (Truncado): ${outputFR.toVerbalA11y()}`);
    // Saída: reste de la division de -10 par 3 est égal à -1 (Arrondi: NBR-5891)
}

exemploToVerbalA11y();
