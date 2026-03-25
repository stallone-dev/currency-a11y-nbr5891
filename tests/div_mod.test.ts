import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CurrencyNBR } from "../mod.ts";

describe("Operações de Inteiros: divInt e mod (Unit)", () => {
    describe("divInt (Divisão Inteira)", () => {
        it("deve realizar divisão inteira simples (10 // 3 = 3) [Default Euclidean]", () => {
            const result = CurrencyNBR.from(10).divInt(3).commit(0);
            expect(result.toString()).toBe("3");
        });

        it("deve realizar divisão inteira com decimais no dividendo (10.5 // 3 = 3) [Default Euclidean]", () => {
            const result = CurrencyNBR.from("10.5").divInt(3).commit(0);
            expect(result.toString()).toBe("3");
        });

        it("deve realizar divisão inteira com resultado negativo (-10 // 3 = -4) [Default Euclidean/Floor]", () => {
            // Euclidean/Floor: floor(-3.33) = -4
            const result = CurrencyNBR.from(-10).divInt(3).commit(0);
            expect(result.toString()).toBe("-4");
        });

        it("deve realizar divisão inteira com resultado negativo (-10 // 3 = -3) [Strategy Truncated]", () => {
            // Truncated: trunc(-3.33) = -3
            const result = CurrencyNBR.from(-10).divInt(3, { modStrategy: "truncated" }).commit(0);
            expect(result.toString()).toBe("-3");
        });

        it("deve realizar divisão inteira (5 // -3 = -2) [Default Euclidean/Floor]", () => {
             // 5 / -3 = -1.66 -> Floor = -2
            const result = CurrencyNBR.from(5).divInt(-3).commit(0);
            expect(result.toString()).toBe("-2");
        });

        it("deve realizar divisão inteira (5 // -3 = -1) [Strategy Truncated]", () => {
             // 5 / -3 = -1.66 -> Trunc = -1
            const result = CurrencyNBR.from(5).divInt(-3, { modStrategy: "truncated" }).commit(0);
            expect(result.toString()).toBe("-1");
        });

        it("deve lançar erro em divisão inteira por zero", () => {
            expect(() => CurrencyNBR.from(10).divInt(0)).toThrow();
        });

        it("deve validar outputs auditáveis para divInt (Euclidean Default)", () => {
            const output = CurrencyNBR.from(10).divInt(3).commit(0);
            expect(output.toLaTeX()).toContain("\\lfloor \\frac{10}{3} \\rfloor");
            expect(output.toLaTeX()).toContain("\\text{round}_{NBR}(3, 0)");
            expect(output.toUnicode()).toContain("⌊10 ÷ 3⌋");
            expect(output.toUnicode()).toContain("roundₙʙᵣ(3, 0)");
            expect(output.toVerbalA11y()).toContain("10 dividido inteiramente por 3");
        });

        it("deve validar outputs auditáveis para divInt (Truncated)", () => {
            const output = CurrencyNBR.from(10).divInt(3, { modStrategy: "truncated" }).commit(0);
            expect(output.toLaTeX()).toContain("\\text{trunc}\\left( \\frac{10}{3} \\right)");
            expect(output.toUnicode()).toContain("trunc(10 ÷ 3)");
            expect(output.toVerbalA11y()).toContain("10 trunc 3");
        });
    });

    describe("mod (Módulo)", () => {
        it("deve calcular o módulo simples (10 % 3 = 1) [Default Euclidean]", () => {
            const result = CurrencyNBR.from(10).mod(3).commit(0);
            expect(result.toString()).toBe("1");
        });

        it("deve calcular o módulo com decimais (10.5 % 3 = 1.5) [Default Euclidean]", () => {
            const result = CurrencyNBR.from("10.5").mod(3).commit(1);
            expect(result.toString()).toBe("1.5");
        });

        it("deve calcular o módulo com dividendo negativo (-10 mod 3 = 2) [Default Euclidean]", () => {
            // Euclidean: ((-10 % 3) + 3) % 3 = (-1 + 3) % 3 = 2
            const result = CurrencyNBR.from(-10).mod(3).commit(0);
            expect(result.toString()).toBe("2");
        });

        it("deve calcular o módulo com dividendo negativo usando estratégia 'truncated' (-10 % 3 = -1)", () => {
            // Truncated (JS style): -10 % 3 = -1
            const result = CurrencyNBR.from(-10).mod(3, { modStrategy: "truncated" }).commit(0);
            expect(result.toString()).toBe("-1");
        });

        it("deve calcular o módulo com dividendo negativo usando estratégia 'euclidean' explícita (-10 mod 3 = 2)", () => {
            const result = CurrencyNBR.from(-10).mod(3, { modStrategy: "euclidean" }).commit(0);
            expect(result.toString()).toBe("2");
        });

        it("deve lançar erro em cálculo de módulo por zero", () => {
            expect(() => CurrencyNBR.from(10).mod(0)).toThrow();
        });

        it("deve validar outputs auditáveis para mod (Euclidean Default)", () => {
            const output = CurrencyNBR.from(10).mod(3).commit(0);
            // Euclidean uses \bmod
            expect(output.toLaTeX()).toContain("10 \\bmod 3");
            expect(output.toLaTeX()).toContain("\\text{round}_{NBR}(1, 0)");
            expect(output.toUnicode()).toContain("10 mod 3");
            expect(output.toUnicode()).toContain("roundₙʙᵣ(1, 0)");
            expect(output.toVerbalA11y()).toContain("10 módulo 3");
        });

        it("deve validar outputs auditáveis para mod (Truncated)", () => {
            const output = CurrencyNBR.from(10).mod(3, { modStrategy: "truncated" }).commit(0);
            // Truncated uses \text{ rem }
            expect(output.toLaTeX()).toContain("10 \\text{ rem } 3");
            expect(output.toUnicode()).toContain("10 % 3");
            expect(output.toVerbalA11y()).toContain("10 resto 3");
        });
    });

    describe("Integração e Encadeamento", () => {
        it("deve suportar operações mistas: (10 * 2) // 3 + 1", () => {
            // (10 * 2) = 20
            // 20 // 3 = 6
            // 6 + 1 = 7
            const result = CurrencyNBR.from(10).mult(2).group().divInt(3).add(1).commit(0);
            expect(result.toString()).toBe("7");
        });
    });
});
