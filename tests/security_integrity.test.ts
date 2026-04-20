import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertRejects } from "@std/assert";
import { CalcAUY } from "@calcauy";
import { CalcAUYError } from "../src/core/errors.ts";

describe("CalcAUY - Segurança e Integridade (BLAKE3)", () => {
    it("deve gerar assinaturas idênticas para cálculos idênticos e mesmo salt", async () => {
        CalcAUY.setSecurityPolicy({ salt: "secret_123" });

        const calc1 = CalcAUY.from(10).add(5);
        const sig1 = JSON.parse(await calc1.hibernate()).signature;

        const calc2 = CalcAUY.from(10).add(5);
        const sig2 = JSON.parse(await calc2.hibernate()).signature;

        assertEquals(sig1, sig2);
    });

    it("deve gerar assinaturas diferentes para salts diferentes", async () => {
        const calc = CalcAUY.from(10).add(5);

        CalcAUY.setSecurityPolicy({ salt: "salt_A" });
        const sigA = JSON.parse(await calc.hibernate()).signature;

        CalcAUY.setSecurityPolicy({ salt: "salt_B" });
        const sigB = JSON.parse(await calc.hibernate()).signature;

        if (sigA === sigB) {
            throw new Error("Assinaturas deveriam ser diferentes para salts diferentes.");
        }
    });

    it("deve garantir integridade em metadados aninhados e ordenação de chaves", async () => {
        CalcAUY.setSecurityPolicy({ salt: "test" });

        // Ordem de chaves diferente, mas conteúdo idêntico
        const calc1 = CalcAUY.from(10).setMetadata("meta", { a: 1, b: 2, c: 3 });
        const calc2 = CalcAUY.from(10).setMetadata("meta", { c: 3, a: 1, b: 2 });

        const sig1 = JSON.parse(await calc1.hibernate()).signature;
        const sig2 = JSON.parse(await calc2.hibernate()).signature;

        assertEquals(sig1, sig2);
    });

    it("deve lançar erro fatal ao tentar hidratar dados com assinatura violada", async () => {
        CalcAUY.setSecurityPolicy({ salt: "lacre" });

        const calc = CalcAUY.from(100).setMetadata("audit", "legal");
        const serialized = await calc.hibernate();

        // Violação proposital: muda um bit no metadado
        const corrupted = serialized.replace('"legal"', '"illegal"');

        await assertRejects(
            async () => {
                await CalcAUY.hydrate(corrupted);
            },
            CalcAUYError,
            "Violação de integridade detectada",
        );
    });

    it("deve lançar erro se a assinatura estiver ausente", async () => {
        const payload = { kind: "literal", value: { n: "10", d: "1" }, originalInput: "10" };

        await assertRejects(
            async () => {
                await CalcAUY.hydrate(payload);
            },
            CalcAUYError,
            "Assinatura de integridade ausente",
        );
    });

    it("deve validar a integridade do commit e do rastro de auditoria", async () => {
        await CalcAUY.setSecurityPolicy({ salt: "prod_salt" });

        const res = await CalcAUY.from(10).div(3).commit({ roundStrategy: "TRUNCATE" });
        const auditTrace = res.toAuditTrace();

        // Deve hidratar sem erros, passando o salt correto
        const rehydrated = await CalcAUY.hydrate(auditTrace, { salt: "prod_salt" });
        assertEquals(await (await rehydrated.commit()).toStringNumber({ decimalPrecision: 4 }), "3.3333");

        // Violação no resultado final (muda a estratégia no rastro)
        const corruptedAudit = auditTrace.replace('"TRUNCATE"', '"NBR5891"');
        await assertRejects(
            async () => {
                await CalcAUY.hydrate(corruptedAudit, { salt: "prod_salt" });
            },
            CalcAUYError,
            "Violação de integridade detectada",
        );
    });

    it("deve verificar assinatura via método estático checkIntegrity", async () => {
        CalcAUY.setSecurityPolicy({ salt: "check" });
        const calc = CalcAUY.from(50);
        const signed = await calc.hibernate();

        const isValid = await CalcAUY.checkIntegrity(signed, { salt: "check" });
        assertEquals(isValid, true);

        // Se usar o salt errado na verificação, a assinatura deve invalidar
        await assertRejects(
            async () => {
                await CalcAUY.checkIntegrity(signed, { salt: "wrong_salt" });
            },
            CalcAUYError,
            "Violação de integridade detectada",
        );
    });
});
