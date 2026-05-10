import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertStringIncludes, assertMatch } from "@std/assert";
import { CalcAUYError } from "@src/core/errors.ts";

describe("Core: CalcAUYError", () => {
    it("deve criar um erro com as propriedades RFC 7807 corretas", () => {
        const detail = "Teste de erro";
        const context = { op: "add", val: 10 };
        const err = new CalcAUYError("invalid-syntax", detail, context);

        assertEquals(err.name, "CalcAUYError");
        assertEquals(err.title, "invalid-syntax");
        assertEquals(err.status, 400);
        assertEquals(err.detail, detail);
        assertEquals(err.context, context);
        assertStringIncludes(err.type, "wiki/errors/invalid-syntax.md");
        assertMatch(err.instance, /^urn:uuid:[0-9a-f-]{36}$/);
    });

    it("deve mapear corretamente os status HTTP para cada categoria", () => {
        const scenarios: Array<{ cat: any, status: number }> = [
            { cat: "invalid-syntax", status: 400 },
            { cat: "division-by-zero", status: 422 },
            { cat: "instance-mismatch", status: 403 },
            { cat: "corrupted-node", status: 500 },
        ];

        for (const { cat, status } of scenarios) {
            const err = new CalcAUYError(cat, "detalhe");
            assertEquals(err.status, status, `Categoria ${cat} deve ter status ${status}`);
        }
    });

    it("toJSON: deve retornar um objeto plano para serialização", () => {
        const err = new CalcAUYError("math-overflow", "Estouro");
        const json = err.toJSON();

        assertEquals(json.title, "math-overflow");
        assertEquals(json.status, 422);
        assertEquals(typeof json.instance, "string");
        assertEquals(typeof json.context, "object");
    });

    it("deve suportar o campo 'cause' nativo do Error", () => {
        const cause = new Error("Causa raiz");
        const err = new CalcAUYError("unsupported-type", "Erro", {}, { cause });

        assertEquals(err.cause, cause);
    });
});
