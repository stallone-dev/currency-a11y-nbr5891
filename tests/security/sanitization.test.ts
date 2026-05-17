/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0 */
import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { CalcAUY } from "@src/main.ts";
import { sanitizeAST, sanitizeObject } from "@src/utils/sanitizer.ts";

const REDACTED = "[PII]";

describe("Security: PII Sanitization & Data Protection", () => {
    it("deve ocultar dados sensíveis por padrão (sensitive: true)", async () => {
        const Private = CalcAUY.create({ contextLabel: "p", salt: "s", sensitive: true });
        const calc = Private.from(100).setMetadata("secret", "pii-data");

        const { ast } = JSON.parse(await calc.hibernate());
        const sanitized = sanitizeAST(ast) as any;
        assertEquals(sanitized.value, { n: REDACTED, d: REDACTED });
        assertEquals(sanitized.metadata.secret, REDACTED);
    });

    it("deve respeitar override pii: false no metadado do nó", async () => {
        const Private = CalcAUY.create({ contextLabel: "p", salt: "s", sensitive: true });
        const calc = Private.from(200).setMetadata("pii", false).setMetadata("info", "public");

        const { ast } = JSON.parse(await calc.hibernate());
        const sanitized = sanitizeAST(ast) as any;
        assertEquals(sanitized.value.n, "200");
        assertEquals(sanitized.metadata.info, "public");
    });

    it("deve ocultar dados mesmo com global sensitive: false se o nó tiver pii: true", async () => {
        const Public = CalcAUY.create({ contextLabel: "p", salt: "s", sensitive: false });
        const calc = Public.from(300).setMetadata("pii", true);

        const { ast } = JSON.parse(await calc.hibernate());
        const sanitized = sanitizeAST(ast) as any;
        assertEquals(sanitized.value, { n: REDACTED, d: REDACTED });
    });

    it("deve sanitizar objetos de contexto de erro recursivamente", () => {
        const context = {
            rawInput: "123.45",
            nested: { secret: "PII", val: 10 },
        };

        // Por padrão no CalcAUYError a sanitização usa a política global.
        // Aqui testamos a utilidade diretamente.
        const sanitized = sanitizeObject(context) as any;
        assertEquals(sanitized.rawInput, REDACTED);
        assertEquals(sanitized.nested.secret, REDACTED);
        assertEquals(sanitized.nested.val, REDACTED); // Números também são sanitizados por segurança
    });

    it("deve manter tipos de operação visíveis no rastro sanitizado para auditoria estrutural", async () => {
        const Private = CalcAUY.create({ contextLabel: "p", salt: "s", sensitive: true });
        const calc = Private.from(10).add(20);

        const { ast } = JSON.parse(await calc.hibernate());
        const sanitized = sanitizeAST(ast) as any;
        assertEquals(sanitized.type, "add", "O tipo de operação deve permanecer visível");
        assertEquals(sanitized.operands[0].kind, "literal");
        assertEquals(sanitized.operands[0].value.n, REDACTED);
    });
});
