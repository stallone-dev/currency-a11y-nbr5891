import { describe, it } from "@std/testing/bdd";
import { assertThrows } from "@std/assert";
import { validateMetadata } from "@src/core/metadata.ts";
import { CalcAUYError } from "@src/core/errors.ts";

describe("Core: Metadata Validation", () => {
    describe("Tipos Permitidos", () => {
        it("deve aceitar strings, números e booleanos", () => {
            validateMetadata("teste");
            validateMetadata(123.45);
            validateMetadata(true);
            validateMetadata(0);
        });

        it("deve aceitar objetos planos (plain objects)", () => {
            validateMetadata({ key: "value", nested: { a: 1 } });
        });

        it("deve aceitar arrays de tipos permitidos", () => {
            validateMetadata([1, "a", { b: true }]);
        });
    });

    describe("Tipos Proibidos", () => {
        it("deve rejeitar null e undefined", () => {
            assertThrows(() => validateMetadata(null), CalcAUYError);
            assertThrows(() => validateMetadata(undefined), CalcAUYError);
        });

        it("deve rejeitar BigInt puro", () => {
            assertThrows(() => validateMetadata(10n), CalcAUYError, "Metadados não podem conter BigInt puro. Converta para string ou use objetos planos.");
        });

        it("deve rejeitar funções e símbolos", () => {
            assertThrows(() => validateMetadata(() => {}), CalcAUYError);
            assertThrows(() => validateMetadata(Symbol("test")), CalcAUYError);
        });

        it("deve rejeitar instâncias de classes (não-planos)", () => {
            class MyClass { a = 1; }
            assertThrows(() => validateMetadata(new MyClass()), CalcAUYError, "Metadados permitem apenas objetos planos (plain objects). Classes ou instâncias não são permitidas.");
            assertThrows(() => validateMetadata(new Date()), CalcAUYError);
            assertThrows(() => validateMetadata(new Map()), CalcAUYError);
        });
    });

    describe("Integridade e Segurança", () => {
        it("deve detectar referências circulares em objetos", () => {
            const obj: any = { a: 1 };
            obj.self = obj;
            assertThrows(() => validateMetadata(obj), CalcAUYError, "Referência circular detectada nos metadados.");
        });

        it("deve detectar referências circulares em arrays", () => {
            const arr: any[] = [1];
            arr.push(arr);
            assertThrows(() => validateMetadata(arr), CalcAUYError, "Referência circular detectada nos metadados.");
        });

        it("deve validar profundamente estruturas aninhadas", () => {
            const complex = {
                a: [1, 2, { b: 3 }],
                c: { d: { e: "fail" } }
            };
            // Mocking a failure inside
            (complex.c.d.e as any) = 10n;
            assertThrows(() => validateMetadata(complex), CalcAUYError);
        });
    });
});
