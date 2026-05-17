/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0 */
import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { Lexer } from "@src/parser/lexer.ts";

describe("Builder: Lexer (Tokenização)", () => {
    it("deve identificar o token DOUBLE_SLASH (//) para divisão inteira", () => {
        const lexer = new Lexer("10 // 3");
        const tokens = lexer.tokenize();

        assertEquals(tokens[1].type, "DOUBLE_SLASH");
        assertEquals(tokens[1].value, "//");
        assertEquals(tokens[1].pos, 3);
    });

    it("deve identificar o token PERCENT (%) para módulo", () => {
        const lexer = new Lexer("10 % 3");
        const tokens = lexer.tokenize();

        assertEquals(tokens[1].type, "PERCENT");
        assertEquals(tokens[1].value, "%");
    });

    it("deve lançar erro ao encontrar um caractere inesperado", () => {
        const lexer = new Lexer("10 @ 5");
        assertThrows(
            () => lexer.tokenize(),
            Error,
            "Caractere inesperado: '@' na posição 3",
        );
    });

    it("deve ler números que terminam com ponto corretamente", () => {
        const lexer = new Lexer("10.");
        const tokens = lexer.tokenize();
        assertEquals(tokens[0].type, "NUMBER");
        assertEquals(tokens[0].value, "10.");
    });

    it("deve lançar erro para ponto isolado sem dígitos seguintes", () => {
        const lexer = new Lexer(". ");
        assertThrows(
            () => lexer.tokenize(),
            Error,
            "Caractere inesperado: '.' na posição 0",
        );
    });

    it("deve ler números em notação científica (e, E, +, -)", () => {
        const scenarios = [
            { input: "1.2e3", expected: "1.2e3" },
            { input: "1.2E3", expected: "1.2E3" },
            { input: "1.2e+3", expected: "1.2e+3" },
            { input: "1.2e-3", expected: "1.2e-3" },
            { input: "10e2", expected: "10e2" },
        ];

        for (const { input, expected } of scenarios) {
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();
            assertEquals(tokens[0].type, "NUMBER");
            assertEquals(tokens[0].value, expected);
        }
    });

    it("deve interromper a leitura do número em caractere inválido após 'e'", () => {
        const lexer = new Lexer("1.2ex");
        // O lexer consome '1.2e' como número (embora o parser possa falhar depois)
        // Mas no Lexer atual, se 'x' não é digit/_/./+/-, ele para.
        // Vamos ver o comportamento exato: readNumber consome 1.2e e para no x.
        const tokens = lexer.tokenize();
        assertEquals(tokens[0].value, "1.2e");
        // O próximo token 'x' causa erro.
        const lexer2 = new Lexer("1.2ex");
        assertThrows(() => lexer2.tokenize(), Error, "Caractere inesperado: 'x'");
    });

    it("deve suportar underscores como separadores de milhar", () => {
        const lexer = new Lexer("1_000_000.50");
        const tokens = lexer.tokenize();
        assertEquals(tokens[0].value, "1_000_000.50");
    });

    it("deve lidar com espaços, tabs e quebras de linha", () => {
        const lexer = new Lexer("10\t+\n\r 5");
        const tokens = lexer.tokenize();
        assertEquals(tokens.length, 4); // 10, +, 5, EOF
        assertEquals(tokens[0].value, "10");
        assertEquals(tokens[1].type, "PLUS");
        assertEquals(tokens[2].value, "5");
    });
});
