import { describe, it } from "@std/testing/bdd";
import { assertStringIncludes, assertFalse } from "@std/assert";
import { CalcAUY } from "@src/main.ts";

describe("Repro: Mermaid PII Redaction", () => {
    it("should NOT redact data by default when sensitive is true but pii is undefined", async () => {
        const Engine = CalcAUY.create({
            contextLabel: "repro-default",
            salt: "salt",
            sensitive: true // Padrão
        });

        const output = await Engine.from(123).setMetadata("info", "test").commit();
        const graph = output.toMermaidGraph();

        // Esperamos que NÃO contenha [REDACTED] no novo comportamento
        assertFalse(graph.includes("[REDACTED]"), "Should not contain [REDACTED]");
        assertFalse(graph.includes("[PII]"), "Should not contain [PII]");
        assertStringIncludes(graph, "123");
        assertStringIncludes(graph, "info: test");
    });

    it("should redact data ONLY when pii is explicitly true", async () => {
        const Engine = CalcAUY.create({
            contextLabel: "repro-explicit",
            salt: "salt",
            sensitive: false // Mesmo com sensitive false, se pii: true, deve redigir
        });

        const output = await Engine.from(456).setMetadata("pii", true).setMetadata("secret", "top").commit();
        const graph = output.toMermaidGraph();

        assertStringIncludes(graph, "[REDACTED]");
        assertStringIncludes(graph, "secret: [PII]");
    });
});
