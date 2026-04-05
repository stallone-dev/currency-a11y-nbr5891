/**
 * @title Exemplo 07: Validação e Parsing de Input (CalcAUD.from())
 * @description Demonstra exaustivamente os formatos de entrada válidos e inválidos aceitos pela CalcAUD.
 * @tags parser, input, validation, errors
 */

import { CalcAUD } from "../../src/main.ts";
import { CalcAUDError } from "../../src/errors.ts";

function demonstrarParserInput() {
    console.log("--- CalcAUD.from(): Demonstração do Parser de Input ---");

    console.log("--- Entradas Válidas ---");

    // 1. Números Inteiros (Number, String, BigInt)
    const intNum = CalcAUD.from(123);
    console.log(`1. Number (123): ${intNum.commit(0).toString()}`);
    const intStr = CalcAUD.from("456");
    console.log(`2. String ("456"): ${intStr.commit(0).toString()}`);
    const intBigInt = CalcAUD.from(789n);
    console.log(`3. BigInt (789n): ${intBigInt.commit(0).toString()}`);

    // 2. Números Decimais (String e Number)
    const decStr = CalcAUD.from("123.45");
    console.log(`4. String ("123.45"): ${decStr.commit(2).toString()}`);
    const decNum = CalcAUD.from(67.89); // CUIDADO: number pode ter imprecisão
    console.log(`5. Number (67.89): ${decNum.commit(2).toString()}`);

    // 3. Decimais com notação abreviada (ponto inicial, negativo)
    const decPoint = CalcAUD.from(".5");
    console.log(`6. String (".5"): ${decPoint.commit(1).toString()}`); // Saída: 0.5
    const decNegPoint = CalcAUD.from("-.5");
    console.log(`7. String ("-.5"): ${decNegPoint.commit(1).toString()}`); // Saída: -0.5
    const decPlusPoint = CalcAUD.from("+.5");
    console.log(`8. String ("+.5"): ${decPlusPoint.commit(1).toString()}`); // Saída: 0.5

    // 4. Strings com Underscores (separadores visuais)
    const underScore = CalcAUD.from("1_000_000.50");
    console.log(`9. String ("1_000_000.50"): ${underScore.commit(2).toString()}`);

    // 5. Frações (String)
    const fraction = CalcAUD.from("1/3");
    console.log(`10. String ("1/3"): ${fraction.commit(4).toString()}`); // Saída: 0.3333
    const negFraction = CalcAUD.from("-2/5");
    console.log(`11. String ("-2/5"): ${negFraction.commit(1).toString()}`); // Saída: -0.4

    // 6. Notação Científica (String)
    const scientificPos = CalcAUD.from("1.23e3"); // 1230
    console.log(`12. String ("1.23e3"): ${scientificPos.commit(0).toString()}`);
    const scientificNeg = CalcAUD.from("4.5e-2"); // 0.045
    console.log(`13. String ("4.5e-2"): ${scientificNeg.commit(3).toString()}`);
    const scientificPoint = CalcAUD.from(".5e2"); // 50
    console.log(`14. String (".5e2"): ${scientificPoint.commit(0).toString()}`);

    console.log("--- Entradas Inválidas (devem lançar CalcAUDError) ---");

    const testInvalidInput = (input: any) => {
        try {
            CalcAUD.from(input);
            console.log(`❌ ERRO: "${input}" deveria ser inválido, mas foi aceito.`);
        } catch (e) {
            if (e instanceof CalcAUDError) {
                console.log(`✅ OK: "${input}" rejeitado. Tipo: ${e.title}`);
            } else {
                console.log(`❌ ERRO: "${input}" rejeitado com erro inesperado: ${e.message}`);
            }
        }
    };

    // 1. Strings não numéricas
    testInvalidInput("abc");
    testInvalidInput("100 reais");
    testInvalidInput(" "); // String vazia com espaço
    testInvalidInput(""); // String vazia

    // 2. Números inválidos
    testInvalidInput(NaN);
    testInvalidInput(Infinity);
    testInvalidInput(-Infinity);

    // 3. Formatos ambíguos ou não suportados (ex: vírgula como separador decimal)
    testInvalidInput("1.000,00"); // Ponto milhar, vírgula decimal (não suportado diretamente)
    testInvalidInput("1,000.00"); // Vírgula milhar (não suportado diretamente)
    testInvalidInput("1/2/3"); // Fração malformada

    // 4. Booleans e Nulos
    testInvalidInput(true);
    testInvalidInput(false);
    testInvalidInput(null);
    testInvalidInput(undefined);
}

demonstrarParserInput();
