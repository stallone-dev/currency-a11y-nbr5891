import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CalcAUD } from "../mod.ts";

describe("Configurações de Output: locale e currency", () => {
    it("deve usar a moeda padrão para pt-BR (BRL) quando nada for definido", () => {
        const output = CalcAUD.from(10).commit(2);
        // Default is pt-BR / BRL
        expect(output.toMonetary()).toContain("R$");
    });

    it("deve usar a moeda vinculada ao locale (USD para en-US)", () => {
        const output = CalcAUD.from(10).commit(2, { locale: "en-US" });
        expect(output.toMonetary()).toContain("$");
    });

    it("deve usar uma moeda personalizada independente do locale (Ex: pt-BR com CNY)", () => {
        const output = CalcAUD.from(10).commit(2, {
            locale: "pt-BR",
            currency: "CNY",
        });
        // Formata com locale pt-BR mas usa símbolo de CNY
        // O Intl.NumberFormat para pt-BR com currency CNY deve renderizar algo como "CN¥ 10,00" ou similar
        expect(output.toMonetary()).toContain("CN¥");
    });

    it("deve usar uma moeda personalizada independente do locale (Ex: en-US com EUR)", () => {
        const output = CalcAUD.from(10).commit(2, {
            locale: "en-US",
            currency: "EUR",
        });
        expect(output.toMonetary()).toContain("€");
    });

    it("deve usar BRL se nada for definido e o locale for omitido", () => {
        const output = CalcAUD.from(10).commit(2, { roundingMethod: "HALF-UP" });
        expect(output.toMonetary()).toContain("R$");
    });

    describe("Novos métodos de BigInt e Cache", () => {
        it("deve retornar o valor em centavos (escala reduzida) via toCentsInBigInt", () => {
            // 10.50 -> 10.50 * 10^2 = 1050
            const output = CalcAUD.from("10.50").commit(2);
            expect(output.toCentsInBigInt()).toBe(1050n);
        });

        it("deve retornar o valor bruto interno via toRawInternalBigInt", () => {
            // 10.50 -> 10.50 * 10^12 = 10500000000000
            const output = CalcAUD.from("10.50").commit(2);
            expect(output.toRawInternalBigInt()).toBe(10500000000000n);
        });

        it("deve manter a consistência entre toString e toCentsInBigInt (usando cache)", () => {
            const output = CalcAUD.from("123.456").commit(2, {
                roundingMethod: "HALF-UP",
            });
            // Arredonda 123.456 para 123.46
            expect(output.toString()).toBe("123.46");
            expect(output.toCentsInBigInt()).toBe(12346n);
        });

        it("deve gerar JSON com elementos padrão e metadados corretos via toJson", () => {
            const output = CalcAUD.from("100").commit(2, {
                currency: "JPY",
            });
            const json = JSON.parse(output.toJson());

            // Verifica metadados
            expect(json.meta.options.currency).toBe("JPY");
            expect(json.meta.decimals).toBe(2);

            // Verifica elementos padrão (existência)
            expect(json.toString).toBeDefined();
            expect(json.toCentsInBigInt).toBeDefined();
            expect(json.toMonetary).toBeDefined();
            expect(json.toLaTeX).toBeDefined();
            expect(json.toUnicode).toBeDefined();
            expect(json.toVerbalA11y).toBeDefined();

            // Elementos fora do padrão não devem estar presentes
            expect(json.toFloatNumber).toBeUndefined();
            expect(json.toRawInternalBigInt).toBeUndefined();
        });
    });

    describe("Traduções de divInt e mod em outros idiomas", () => {
        it("deve traduzir divInt (Euclidean) para en-US", () => {
            const output = CalcAUD.from(10).divInt(3).commit(0, { locale: "en-US" });
            expect(output.toVerbalA11y()).toContain(
                "10 divided by 3, with floor to integer",
            );
        });

        it("deve traduzir mod (Euclidean) para zh-CN", () => {
            const output = CalcAUD.from(10).mod(3).commit(0, { locale: "zh-CN" });
            // "欧几里得模 10 除以 3"
            expect(output.toVerbalA11y()).toContain("欧几里得模 10 除以 3");
        });

        it("deve traduzir mod (Truncated) para ja-JP", () => {
            const output = CalcAUD.from(10).mod(3, "truncated").commit(0, {
                locale: "ja-JP",
            });
            // "[a] の [b] による剰余"
            expect(output.toVerbalA11y()).toContain("10 の 3 による剰余");
        });
    });
});
