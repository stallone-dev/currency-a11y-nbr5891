import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { RationalNumber } from "@src/core/rational.ts";
import { applyRounding } from "@src/core/rounding.ts";

describe("Core: Rounding Strategies", () => {
    describe("NBR 5891 (Norma Brasileira)", () => {
        it("Regra 1: Algarismo seguinte < 5 (85.483 -> 85.48)", () => {
            const val = RationalNumber.from("85.483");
            const res = applyRounding(val, "NBR5891", 2);
            assertEquals(res.toDecimalString(2), "85.48");
        });

        it("Regra 2: Algarismo seguinte > 5 (85.487 -> 85.49)", () => {
            const val = RationalNumber.from("85.487");
            const res = applyRounding(val, "NBR5891", 2);
            assertEquals(res.toDecimalString(2), "85.49");
        });

        it("Regra 3a: 5 seguido de algo diferente de zero (32.751 -> 32.8)", () => {
            const val = RationalNumber.from("32.751");
            const res = applyRounding(val, "NBR5891", 1);
            assertEquals(res.toDecimalString(1), "32.8");
        });

        it("Regra 3b: 5 exato - Par permanece (32.45 -> 32.4)", () => {
            const val = RationalNumber.from("32.45");
            const res = applyRounding(val, "NBR5891", 1);
            assertEquals(res.toDecimalString(1), "32.4");
        });

        it("Regra 3b: 5 exato - Ímpar aumenta (32.75 -> 32.8)", () => {
            const val = RationalNumber.from("32.75");
            const res = applyRounding(val, "NBR5891", 1);
            assertEquals(res.toDecimalString(1), "32.8");
        });

        it("Simetria Negativa: -1.225 -> -1.22", () => {
            const val = RationalNumber.from("-1.225");
            const res = applyRounding(val, "NBR5891", 2);
            assertEquals(res.toDecimalString(2), "-1.22");
        });
    });

    describe("HALF_UP (Comercial)", () => {
        it("deve arredondar 0.5 para cima", () => {
            const val = RationalNumber.from("1.25");
            const res = applyRounding(val, "HALF_UP", 1);
            assertEquals(res.toDecimalString(1), "1.3");
        });

        it("deve manter 0.4 para baixo", () => {
            const val = RationalNumber.from("1.24");
            const res = applyRounding(val, "HALF_UP", 1);
            assertEquals(res.toDecimalString(1), "1.2");
        });
    });

    describe("HALF_EVEN (Banker's)", () => {
        it("deve arredondar para o par mais próximo (1.5 -> 2)", () => {
            const val = RationalNumber.from("1.5");
            const res = applyRounding(val, "HALF_EVEN", 0);
            assertEquals(res.toDecimalString(0), "2");
        });

        it("deve arredondar para o par mais próximo (2.5 -> 2)", () => {
            const val = RationalNumber.from("2.5");
            const res = applyRounding(val, "HALF_EVEN", 0);
            assertEquals(res.toDecimalString(0), "2");
        });
    });

    describe("CEIL (Teto)", () => {
        it("deve arredondar qualquer fração positiva para cima", () => {
            const val = RationalNumber.from("1.01");
            const res = applyRounding(val, "CEIL", 0);
            assertEquals(res.toDecimalString(0), "2");
        });

        it("deve manter inteiros inalterados", () => {
            const val = RationalNumber.from("1.00");
            const res = applyRounding(val, "CEIL", 0);
            assertEquals(res.toDecimalString(0), "1");
        });
    });

    describe("TRUNCATE (Corte)", () => {
        it("deve remover casas decimais sem arredondar", () => {
            const val = RationalNumber.from("1.99");
            const res = applyRounding(val, "TRUNCATE", 0);
            assertEquals(res.toDecimalString(0), "1");
        });
    });

    describe("NONE (Aritmética Pura)", () => {
        it("não deve alterar o valor racional", () => {
            const val = RationalNumber.from("1/3");
            const res = applyRounding(val, "NONE", 2);
            assertEquals(res.n, 1n);
            assertEquals(res.d, 3n);
        });
    });
});
