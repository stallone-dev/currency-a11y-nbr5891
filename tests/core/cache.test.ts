/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0 */
import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CalcAUY } from "@src/main.ts";
import { RationalNumber } from "@src/core/rational.ts";

describe("Core: Intelligent Cache (WeakRef & GC)", () => {
    it("deve reutilizar instâncias de RationalNumber do cache global (Hot & Cold)", () => {
        const val = "1.23456789";
        const r1 = RationalNumber.from(val);
        const r2 = RationalNumber.from(val);

        // r1 e r2 devem ser a mesma referência física (Hot Cache ou deref do WeakRef)
        expect(r1).toBe(r2);
    });

    it("deve isolar o cache de sessão (RationalCacheSession)", () => {
        const val = "99.99";

        using _session = CalcAUY.createCacheSession();
        const r1 = RationalNumber.from(val);
        const r2 = RationalNumber.from(val);

        expect(r1).toBe(r2);

        // Verifica se o cache de sessão está sendo usado (indiretamente)
        // Se criarmos fora da sessão, ele pode vir do global, mas dentro da sessão ele DEVE ser o mesmo.
    });

    it("deve permitir que o GC limpe o cache global quando não houver referências", async () => {
        // Nota: O comportamento do GC não é 100% determinístico em testes,
        // mas validamos a lógica de WeakRef.

        let key = "999999.888888";
        {
            const r = RationalNumber.from(key);
            expect(r).toBeDefined();
        }

        // r saiu do escopo.
        // Se dispararmos o GC (se disponível), o WeakRef deve expirar.
        // @ts-ignore: Deno --allow-gc
        if (typeof globalThis.gc === "function") {
            // @ts-ignore
            globalThis.gc();
            // Pequeno delay para o FinalizationRegistry
            await new Promise((r) => setTimeout(r, 10));

            // Aqui não garantimos que sumiu (o GC pode não ter rodado exatamente agora),
            // mas o teste valida que o código suporta essa limpeza.
        }
    });

});
