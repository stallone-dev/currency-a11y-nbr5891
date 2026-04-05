/**
 * @title Exemplo 01: Fluxo de Checkout de E-commerce
 * @description Demonstra operações aritméticas básicas, imutabilidade e formatação monetária.
 * @tags basics, arithmetic, monetary
 */

import { CalcAUD } from "../../src/main.ts";

// Cenário: Um carrinho de compras com itens, desconto e frete.
// Objetivo: Calcular o subtotal, aplicar desconto percentual, somar frete e gerar recibo.

function calcularCarrinho() {
    console.log("--- Iniciando Checkout ---");

    // 1. Definição de Preços (Entrada via String para garantir precisão)
    const precoItemA = CalcAUD.from("150.50");
    const qtdItemA = 3; // Inteiro primitivo

    const precoItemB = CalcAUD.from("99.90");
    const qtdItemB = 2;

    // 2. Cálculo do Subtotal (Multiplicação e Adição)
    // Nota: Como CalcAUD é imutável, podemos encadear ou salvar em variáveis intermediárias.
    const totalA = precoItemA.mult(qtdItemA);
    const totalB = precoItemB.mult(qtdItemB);

    const subtotal = totalA.add(totalB);

    // 3. Aplicação de Desconto (15% sobre o subtotal)
    // Representamos 15% como "0.15"
    const desconto = subtotal.mult("0.15");

    // 4. Adição de Frete Fixo
    const frete = CalcAUD.from("25.00");

    // 5. Cálculo Final
    // Expressão: (Subtotal - Desconto) + Frete
    const totalFinal = subtotal.sub(desconto).group().add(frete);

    // 6. Commit (Materialização do Resultado)
    // Decidimos a precisão final aqui (2 casas para moeda BRL)
    const output = totalFinal.commit(2, { locale: "pt-BR", currency: "BRL" });

    // --- Resultados ---

    console.log("Memória de Cálculo (LaTeX):");
    console.log(output.toLaTeX());
    // Saída esperada:
    // $$ \left( (150.50 \times 3 + 99.90 \times 2) - ((150.50 \times 3 + 99.90 \times 2) \times 0.15) \right) + 25.00 = ... $$

    console.log("\nDescrição Acessível (Leitor de Tela):");
    console.log(output.toVerbalA11y());

    console.log("\nValor Final (Boleto):");
    console.log(output.toMonetary());

    console.log("\nValor Interno (Centavos para Banco de Dados):");
    console.log(output.toCentsInBigInt()); // Ex: 57866n (R$ 578,66)
}

calcularCarrinho();
