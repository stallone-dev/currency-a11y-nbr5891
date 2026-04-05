/**
 * @title Método: CalcAUDOutput.toJson()
 * @description Exemplos de como serializar o resultado de um cálculo para JSON, com controle sobre os elementos incluídos.
 * @tags toJson, output, serialization, api
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToJson() {
    console.log("--- CalcAUDOutput.toJson(): Exportação JSON ---");

    const calc = CalcAUD.from(100.50).add(50.25).mult("0.15").div(2);
    const output = calc.commit(2, { locale: "en-US", currency: "USD", roundingMethod: "HALF-UP" });

    // Exemplo 1: Exportação JSON padrão (sem especificar 'elements')
    // Utiliza DEFAULT_JSON_ELEMENTS: toString, toCentsInBigInt, toMonetary, toLaTeX, toUnicode, toVerbalA11y
    const jsonPadrao = JSON.parse(output.toJson());
    console.log("1. JSON Padrão:");
    console.log(JSON.stringify(jsonPadrao, null, 2));
    // Verifica a presença de elementos padrão e metadados
    console.assert(jsonPadrao.meta.currency === "USD", "Meta Currency should be USD");
    console.assert(typeof jsonPadrao.toString === "string", "toString should be present");
    console.assert(typeof jsonPadrao.toCentsInBigInt === "string", "toCentsInBigInt should be present");

    // Exemplo 2: Exportação JSON com elementos específicos
    const jsonEspecifico = JSON.parse(output.toJson(["toFloatNumber", "toRawInternalBigInt"]));
    console.log(" 2. JSON com elementos específicos (toFloatNumber, toRawInternalBigInt):");
    console.log(JSON.stringify(jsonEspecifico, null, 2));
    // Verifica a presença dos elementos solicitados
    console.assert(typeof jsonEspecifico.toFloatNumber === "number", "toFloatNumber should be present");
    console.assert(typeof jsonEspecifico.toRawInternalBigInt === "string", "toRawInternalBigInt should be present");
    // Verifica a ausência de elementos não solicitados
    console.assert(jsonEspecifico.toString === undefined, "toString should NOT be present");

    // Exemplo 3: Exportação JSON completa (todos os métodos disponíveis)
    const jsonCompleto = JSON.parse(output.toJson(output.AVAILABLE_OUTPUT_METHODS));
    console.log("3. JSON Completo (todos os métodos, fragmento):");
    console.log(JSON.stringify({ ...jsonCompleto, toImageBuffer: "[Buffer Array Omitted]" }, null, 2));
    console.assert(jsonCompleto.toImageBuffer !== undefined, "toImageBuffer should be present");
}

exemploToJson();
