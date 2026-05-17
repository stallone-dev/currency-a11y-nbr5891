/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0 */
import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertStringIncludes } from "@std/assert";
import { CalcAUY } from "@src/main.ts";
import { RationalNumber } from "@src/core/rational.ts";
import { applyRounding } from "@src/core/rounding.ts";

describe("Repro: Reported Issues & Regression", () => {
    const Engine = CalcAUY.create({ contextLabel: "repro", salt: "s" });

    it("CEIL rounding: não deve produzir resultados absurdos (0.11 -> 0.2)", () => {
        const val = RationalNumber.from("0.11");
        // ceil(0.11, 1) deve ser 0.2
        const result = applyRounding(val, "CEIL", 1);
        assertEquals(result.toDecimalString(1), "0.2");
    });

    it("Normalização de Input com Ponto Inicial (.5 -> 0.5)", async () => {
        const res = await Engine.from(".5").add(10).commit();

        // Unicode deve conter 0.5 normalizado
        assertStringIncludes(res.toUnicode(), "0.5");
        // LaTeX deve conter 0.5 normalizado
        assertStringIncludes(res.toLaTeX(), "0.5");
    });

    it("Padding em toDecimalString para números pequenos (0.001 -> 0.0010)", () => {
        const val = RationalNumber.from("0.001");
        assertEquals(val.toDecimalString(4), "0.0010");

        const zero = RationalNumber.from("0");
        assertEquals(zero.toDecimalString(4), "0.0000");
    });

    it("Pow: manter alta precisão de 50 dígitos (sqrt 2)", () => {
        const base = RationalNumber.from("2");
        const exp = RationalNumber.from("0.5"); // sqrt(2)
        const result = base.pow(exp);

        const decimal = result.toDecimalString(50);
        const expectedPrefix = "1.41421356237309504880168872420969807856967187537694";
        assertEquals(decimal.substring(0, expectedPrefix.length), expectedPrefix);
    });

    it("Associatividade à Direita na Potência (2^3^2 = 512)", async () => {
        // No Parser: 2 ^ 3 ^ 2 = 2 ^ (3 ^ 2) = 2 ^ 9 = 512
        const res = await Engine.parseExpression("2 ^ 3 ^ 2").commit();
        assertEquals(res.toStringNumber({ decimalPrecision: 0 }), "512");

        // No Fluent API: .pow() consecutivo também deve respeitar a estrutura da árvore
        const fluent = await Engine.from(2).pow(3).pow(2).commit();
        assertEquals(fluent.toStringNumber({ decimalPrecision: 0 }), "512");
    });
});
