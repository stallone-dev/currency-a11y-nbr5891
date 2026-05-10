import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertStringIncludes } from "@std/assert";
import { CalcAUY } from "@src/main.ts";

describe("Output: Visual & Custom (Mermaid, Audit, Custom)", () => {
    const Engine = CalcAUY.create({
        contextLabel: "visual-test",
        salt: "salt",
        roundStrategy: "NBR5891"
    });

    it("toMermaidGraph: deve gerar um diagrama de sequência Mermaid válido", async () => {
        const output = await Engine.from(100).add(50).commit();
        const graph = output.toMermaidGraph();
        
        assertStringIncludes(graph, "sequenceDiagram");
        assertStringIncludes(graph, "participant Ctx_visual_test as Contexto: visual-test");
        assertStringIncludes(graph, "Ingestão");
        assertStringIncludes(graph, "Signature");
    });

    it("toAuditTrace: deve gerar um JSON assinado contendo o AST e o resultado", async () => {
        const output = await Engine.from(100).commit();
        const trace = output.toAuditTrace();
        const data = JSON.parse(trace);
        
        assertEquals(data.contextLabel, "visual-test");
        assertEquals(data.roundStrategy, "NBR5891");
        assertEquals(data.signature !== undefined, true);
        assertEquals(data.finalResult.n, "100");
    });

    it("toCustomOutput: deve permitir extensões via processadores customizados", async () => {
        const output = await Engine.from(100).add(50).commit();
        
        const myProcessor = (ctx: any) => {
            return `O resultado final foi ${ctx.methods.toStringNumber()} com estratégia ${ctx.roundStrategy}`;
        };
        
        const res = output.toCustomOutput(myProcessor);
        assertEquals(res, "O resultado final foi 150.00 com estratégia NBR5891");
    });

    it("toLiveTrace: deve retornar o objeto de rastro para inspeção programática", async () => {
        const output = await Engine.from(10).commit();
        const trace = output.toLiveTrace();
        
        assertEquals(trace.contextLabel, "visual-test");
        assertEquals(trace.ast.kind, "literal");
    });
});
