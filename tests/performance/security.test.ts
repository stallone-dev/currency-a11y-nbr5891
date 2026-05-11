import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertNotEquals, assertRejects, assertStringIncludes, assertThrows } from "@std/assert";
import { CalcAUY } from "@src/main.ts";
import { CalcAUYError } from "@src/core/errors.ts";
import { BIRTH_TICKET_MOCK } from "@src/core/constants.ts";

describe("Security: Cryptographic Integrity & PII", () => {
    const salt = "security-secret-2026";
    const birth = "2026-05-01T10:00:00.000Z";
    const Vault = CalcAUY.create({
        contextLabel: "vault",
        salt: salt,
        roundStrategy: "NBR5891",
        [BIRTH_TICKET_MOCK]: birth,
    });

    it("deve gerar assinaturas idênticas para cálculos idênticos e mesmo salt", async () => {
        const calc1 = Vault.from(100).add(50);
        const sig1 = JSON.parse(await calc1.hibernate()).signature;

        const calc2 = Vault.from(100).add(50);
        const sig2 = JSON.parse(await calc2.hibernate()).signature;

        assertEquals(sig1, sig2);
    });

    it("deve gerar assinaturas diferentes para salts diferentes", async () => {
        const VaultA = CalcAUY.create({ contextLabel: "v", salt: "salt-A" });
        const VaultB = CalcAUY.create({ contextLabel: "v", salt: "salt-B" });

        const sigA = JSON.parse(await VaultA.from(100).hibernate()).signature;
        const sigB = JSON.parse(await VaultB.from(100).hibernate()).signature;

        assertNotEquals(sigA, sigB);
    });

    it("deve garantir integridade com metadados e ordenação determinística de chaves", async () => {
        // Diferentes ordens de chaves no objeto de metadados não devem mudar a assinatura
        const calc1 = Vault.from(100).setMetadata("info", { a: 1, b: 2 });
        const calc2 = Vault.from(100).setMetadata("info", { b: 2, a: 1 });

        const sig1 = JSON.parse(await calc1.hibernate()).signature;
        const sig2 = JSON.parse(await calc2.hibernate()).signature;

        assertEquals(sig1, sig2);
    });

    it("deve detectar adulteração de dados durante a hidratação", async () => {
        const original = Vault.from(1000).setMetadata("status", "approved");
        const signed = await original.hibernate();

        // Ataque: Altera o valor de 1000 para 9000 no JSON assinado
        const tampered = signed.replace('"1000"', '"9000"');

        await assertRejects(
            () => Vault.hydrate(tampered),
            CalcAUYError,
            "Integrity violation during hydration",
        );
    });

    it("deve detectar adulteração do resultado final no Audit Trace", async () => {
        const output = await Vault.from(100).add(50).commit();
        const trace = JSON.parse(output.toAuditTrace());

        // Ataque: Altera o resultado final de 150 para 0 no rastro
        trace.finalResult.n = "0";

        await assertRejects(
            () => Vault.hydrate(trace),
            CalcAUYError,
            "Integrity violation during hydration",
        );
    });

    it("checkIntegrity: deve validar rastro sem hidratar a árvore completa", async () => {
        const output = await Vault.from(500).commit();
        const auditTrace = output.toAuditTrace();

        const isValid = await CalcAUY.checkIntegrity(auditTrace, { salt });
        assertEquals(isValid, true);

        // Falha com salt errado
        await assertRejects(
            () => CalcAUY.checkIntegrity(auditTrace, { salt: "wrong-salt" }),
            CalcAUYError,
            "Integrity violation detected",
        );
    });

    it("PII: deve sanitizar metadados sensíveis se a flag 'sensitive' estiver ativa", async () => {
        const PrivateVault = CalcAUY.create({
            contextLabel: "private",
            salt: "s",
            sensitive: true, // Ativa sanitização de PII
        });

        const calc = PrivateVault.from(100)
            .setMetadata("user_email", "user@example.com")
            .setMetadata("public_info", "OK");

        const output = await calc.commit();
        const mermaid = output.toMermaidGraph();

        // No Mermaid, metadados sensíveis devem ser [REDACTED]
        assertStringIncludes(mermaid, "[REDACTED]");
    });

    it("Cross-Context: deve impedir o uso de .from() com instâncias de outros contextos", () => {
        const ContextA = CalcAUY.create({ contextLabel: "A", salt: "s1" });
        const ContextB = CalcAUY.create({ contextLabel: "B", salt: "s2" });

        const calcA = ContextA.from(100);
        // @ts-ignore: Forçando erro de contexto
        assertThrows(() => ContextB.from(calcA), CalcAUYError, "Attempted to mix instances from different contexts");
    });
});
