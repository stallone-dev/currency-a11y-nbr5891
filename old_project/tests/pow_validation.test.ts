import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CalcAUD } from "../mod.ts";
import { CalcAUDError } from "../src/errors.ts";

describe("CalcAUD.pow - Validação de Expoente", () => {
    it("deve lançar erro para expoente com múltiplas barras (ex: '2/3/5')", () => {
        const base = CalcAUD.from(10);
        expect(() => base.pow("2/3/5")).toThrow(CalcAUDError);
        try {
            base.pow("2/3/5");
        } catch (e) {
            expect((e as CalcAUDError).detail).toContain(
                "O expoente '2/3/5' deve conter apenas um numerador e um denominador.",
            );
        }
    });

    it("deve lançar erro para expoente com caracteres não numéricos (ex: '1/abc')", () => {
        const base = CalcAUD.from(10);
        expect(() => base.pow("1/abc")).toThrow(CalcAUDError);
        try {
            base.pow("1/abc");
        } catch (e) {
            expect((e as CalcAUDError).detail).toContain(
                "Não foi possível converter as partes do expoente para inteiros.",
            );
        }
    });

    it("deve lançar erro para apenas uma barra sem números (ex: '/')", () => {
        const base = CalcAUD.from(10);
        expect(() => base.pow("/")).toThrow(CalcAUDError);
        // Detail check if possible
    });

    it("deve lançar erro para espaços em branco resultando em múltiplas barras (ex: '1 / 2 / 3')", () => {
        const base = CalcAUD.from(10);
        expect(() => base.pow("1 / 2 / 3")).toThrow(CalcAUDError);
    });

    it("deve aceitar expoente fracionário válido com espaços", () => {
        const base = CalcAUD.from(4);
        // "1 / 2" deve ser aceito
        const result = base.pow(" 1 / 2 ");
        const output = result.commit(2);
        expect(output.toString()).toBe("2.00");
    });
});
