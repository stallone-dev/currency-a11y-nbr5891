import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { RationalNumber } from "@src/core/rational.ts";
import { CalcAUYError } from "@src/core/errors.ts";

describe("Core: RationalNumber", () => {
    describe("Criação e Ingestão (Factory)", () => {
        it("deve criar a partir de BigInt (n, d)", () => {
            const r = RationalNumber.from(1n, 2n);
            assertEquals(r.n, 1n);
            assertEquals(r.d, 2n);
        });

        it("deve criar a partir de um inteiro (number)", () => {
            const r = RationalNumber.from(10);
            assertEquals(r.n, 10n);
            assertEquals(r.d, 1n);
        });

        it("deve criar a partir de um decimal (string)", () => {
            const r = RationalNumber.from("10.50");
            assertEquals(r.n, 21n);
            assertEquals(r.d, 2n);
        });

        it("deve criar a partir de notação científica", () => {
            const r = RationalNumber.from("1.5e-2");
            assertEquals(r.n, 3n);
            assertEquals(r.d, 200n);
        });

        it("deve aceitar e normalizar BigInt literal string com 'n'", () => {
            const r = RationalNumber.from("100n");
            assertEquals(r.n, 100n);
            assertEquals(r.d, 1n);
        });

        it("deve suportar percentual (%)", () => {
            const r = RationalNumber.from("15%");
            assertEquals(r.n, 3n);
            assertEquals(r.d, 20n); // 15/100 = 3/20
        });

        it("deve simplificar automaticamente via MDC (GCD)", () => {
            const r = RationalNumber.from(50n, 100n);
            assertEquals(r.n, 1n);
            assertEquals(r.d, 2n);
        });

        it("deve normalizar o sinal (denominador sempre positivo)", () => {
            const r1 = RationalNumber.from(1n, -2n);
            assertEquals(r1.n, -1n);
            assertEquals(r1.d, 2n);

            const r2 = RationalNumber.from(-1n, -2n);
            assertEquals(r2.n, 1n);
            assertEquals(r2.d, 2n);
        });

        it("deve reutilizar instâncias para números pequenos (Cache)", () => {
            const r1 = RationalNumber.from(10);
            const r2 = RationalNumber.from(10);
            assertEquals(r1, r2);
        });

        it("deve lançar erro em divisão por zero na criação", () => {
            assertThrows(() => RationalNumber.from(10n, 0n), CalcAUYError, "O denominador não pode ser zero.");
        });

        it("deve lançar erro para tipos não suportados", () => {
            // @ts-ignore: Testando entrada inválida
            assertThrows(() => RationalNumber.from(Symbol("test")), CalcAUYError);
        });

        it("deve lançar erro para numbers não finitos", () => {
            assertThrows(() => RationalNumber.from(Infinity), CalcAUYError);
            assertThrows(() => RationalNumber.from(NaN), CalcAUYError);
        });

        it("deve lançar erro para strings malformadas", () => {
            assertThrows(() => RationalNumber.from("1.2.3"), CalcAUYError);
            assertThrows(() => RationalNumber.from("abc"), CalcAUYError);
        });
    });

    describe("Operações Aritméticas", () => {
        const r13 = RationalNumber.from("1/3");
        const r16 = RationalNumber.from("1/6");

        it("Adição: 1/3 + 1/6 = 1/2", () => {
            const res = r13.add(r16);
            assertEquals(res.n, 1n);
            assertEquals(res.d, 2n);
        });

        it("Subtração: 1/2 - 1/3 = 1/6", () => {
            const res = RationalNumber.from("1/2").sub(r13);
            assertEquals(res.n, 1n);
            assertEquals(res.d, 6n);
        });

        it("Multiplicação: 2/3 * 3/4 = 1/2", () => {
            const res = RationalNumber.from("2/3").mul(RationalNumber.from("3/4"));
            assertEquals(res.n, 1n);
            assertEquals(res.d, 2n);
        });

        it("Divisão: (1/2) / (1/4) = 2", () => {
            const res = RationalNumber.from("1/2").div(RationalNumber.from("1/4"));
            assertEquals(res.n, 2n);
            assertEquals(res.d, 1n);
        });

        it("Módulo Euclidiano: -10 % 3 = 2", () => {
            const res = RationalNumber.from(-10).mod(RationalNumber.from(3));
            assertEquals(res.n, 2n);
            assertEquals(res.d, 1n);
        });

        it("Divisão Inteira: -10 // 3 = -4", () => {
            const res = RationalNumber.from(-10).divInt(RationalNumber.from(3));
            assertEquals(res.n, -4n);
        });
    });

    describe("Potenciação e Raízes (pow)", () => {
        it("deve calcular potência inteira positiva", () => {
            const res = RationalNumber.from(2).pow(RationalNumber.from(3));
            assertEquals(res.n, 8n);
        });

        it("deve calcular potência inteira negativa (inversão)", () => {
            const res = RationalNumber.from(2).pow(RationalNumber.from(-2));
            assertEquals(res.n, 1n);
            assertEquals(res.d, 4n);
        });

        it("deve calcular raiz quadrada (pow 1/2)", () => {
            const res = RationalNumber.from(16).pow(RationalNumber.from("1/2"));
            assertEquals(res.n, 4n);
        });

        it("deve calcular raiz cúbica de número negativo (índice ímpar)", () => {
            const res = RationalNumber.from(-8).pow(RationalNumber.from("1/3"));
            assertEquals(res.n, -2n);
        });

        it("deve lidar com 0^0 = 1", () => {
            const res = RationalNumber.from(0).pow(RationalNumber.from(0));
            assertEquals(res.n, 1n);
        });

        it("deve lançar erro para raiz par de número negativo (complexo)", () => {
            assertThrows(() => RationalNumber.from(-4).pow(RationalNumber.from("1/2")), CalcAUYError);
        });

        it("deve lançar erro para 0 elevado a expoente negativo", () => {
            assertThrows(() => RationalNumber.from(0).pow(RationalNumber.from(-1)), CalcAUYError);
        });
    });

    describe("Comparação e Utilitários", () => {
        it("Absolute (abs)", () => {
            assertEquals(RationalNumber.from(-5).abs().n, 5n);
        });

        it("Negação (negate)", () => {
            assertEquals(RationalNumber.from(5).negate().n, -5n);
        });

        it("Igualdade (equals)", () => {
            const r1 = RationalNumber.from("1/2");
            const r2 = RationalNumber.from("2/4");
            assertEquals(r1.equals(r2), true);
        });

        it("Comparação (compare)", () => {
            const r1 = RationalNumber.from(10);
            const r2 = RationalNumber.from(5);
            assertEquals(r1.compare(r2), 1);
            assertEquals(r2.compare(r1), -1);
            assertEquals(r1.compare(r1), 0);
        });
    });

    describe("Segurança e Limites", () => {
        it("deve lançar math-overflow ao exceder o limite de bits", () => {
            // MAX_BI_LIMIT é 10^301029 approx.
            const huge = RationalNumber.from(10n ** 400000n);
            assertThrows(
                () => huge.mul(huge),
                CalcAUYError,
                "O resultado da operação excede o limite de segurança de 1000000 bits.",
            );
        });

        it("deve prever estouro em potenciação antes de executar", () => {
            const base = RationalNumber.from(2);
            const exp = RationalNumber.from(1000001); // Acima do limite de 1M bits
            assertThrows(
                () => base.pow(exp),
                CalcAUYError,
                "O expoente resultaria em um número superior ao limite de segurança (1000000 bits).",
            );
        });
    });

    describe("Exportação", () => {
        it("toDecimalString com precisão variável", () => {
            const r = RationalNumber.from("1/3");
            assertEquals(r.toDecimalString(2), "0.33");
            assertEquals(r.toDecimalString(0), "0");
        });

        it("toDecimalString deve lidar com preenchimento de zeros", () => {
            const r = RationalNumber.from("1/100");
            assertEquals(r.toDecimalString(4), "0.0100");
        });

        it("toJSON deve retornar n e d como strings", () => {
            const r = RationalNumber.from("1/2");
            assertEquals(r.toJSON(), { n: "1", d: "2" });
        });
    });
});
