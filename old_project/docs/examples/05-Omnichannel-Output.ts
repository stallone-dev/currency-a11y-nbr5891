/**
 * @title Exemplo 05: Omnichannel Output
 * @description Geração de múltiplos formatos de saída para uma mesma operação (Web, PDF, Console, API).
 * @tags output, image, html, json
 */

import { CalcAUD } from "../../src/main.ts";

function demonstrarOutputs() {
    console.log("--- Geração de Relatório Multi-Canal ---");

    const operacao = CalcAUD.from(1500)
        .mult("0.05") // Juros
        .group()
        .add(50) // Taxa Admin
        .div(2); // Parcelamento

    // Commit final para 2 casas
    const out = operacao.commit(2);

    // 1. Para o Frontend (React/Vue/Angular)
    console.log("HTML (para renderização web):");
    console.log(out.toHTML());

    // 2. Para API REST (Intercâmbio de dados)
    console.log("\nJSON Payload:");
    console.log(out.toJson(["toMonetary", "toVerbalA11y", "toCentsInBigInt"]));

    // 3. Para Geração de PDF (Buffer de Imagem SVG)
    console.log("\nImagem SVG (Buffer):");
    const buffer = out.toImageBuffer();
    console.log(`Tamanho do Buffer: ${buffer.length} bytes`);
    // Em uma aplicação real, você salvaria isso: Deno.writeFile("formula.svg", buffer);

    // 4. Para Leitores de Tela (Acessibilidade)
    console.log("\nTexto Acessível:");
    console.log(out.toVerbalA11y());

    // 5. Para Logs de Auditoria em Texto Puro
    console.log("\nUnicode (Log):");
    console.log(out.toUnicode());
}

demonstrarOutputs();
