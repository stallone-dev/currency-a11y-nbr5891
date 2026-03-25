import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CalcAUDError } from "../src/errors.ts";

describe("CalcAUDError (RFC 7807)", () => {
    it("deve seguir a estrutura JSON da RFC 7807", () => {
        const err = new CalcAUDError({
            type: "division-by-zero",
            title: "Operação Matemática Inválida",
            detail: "Tentativa de divisão por zero.",
            status: 400,
            operation: "division",
            latex: "\\frac{10}{0}",
            unicode: "10 ÷ 0",
        });

        const json = err.toJSON();

        expect(json.type).toBe("https://github.com/st-all-one/calcaud-nbr-a11y/tree/main/errors/division-by-zero");
        expect(json.title).toBe("Operação Matemática Inválida");
        expect(json.status).toBe(400);
        expect(json.detail).toBe("Tentativa de divisão por zero.");
        expect(json.instance).toMatch(/^audit:err:[0-9a-f-]{36}$/);

        expect(json.math_audit?.operation).toBe("division");
        expect(json.math_audit?.latex).toBe("\\frac{10}{0}");
        expect(json.math_audit?.unicode).toBe("10 ÷ 0");
    });

    it("deve funcionar sem campos opcionais de math_audit", () => {
        const err = new CalcAUDError({
            type: "generic-error",
            title: "Erro Genérico",
            detail: "Ocorreu um erro inesperado.",
        });

        const json = err.toJSON();
        expect(json.math_audit).toBeUndefined();
    });
});
