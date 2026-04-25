/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertStringIncludes } from "@std/assert";
import { CalcAUY } from "@calcauy";

describe("Output toMermaidGraph - Sequence Diagram (Ledger-view)", () => {
    it("deve gerar um diagrama simples para um contexto único", async () => {
        const Calc = CalcAUY.create({ contextLabel: "vendas", salt: "s1", sensitive: false });
        const res = await Calc.from(100).add(50).commit();

        const graph = res.toMermaidGraph();

        assertStringIncludes(graph, "sequenceDiagram");
        assertStringIncludes(graph, "autonumber");
        assertStringIncludes(graph, "participant Ctx_vendas as Contexto: vendas");
        assertStringIncludes(graph, "Ingestão de Operandos:");
        assertStringIncludes(graph, "• 100");
        assertStringIncludes(graph, "• 50");
        assertStringIncludes(graph, "Ctx_vendas->>Ctx_vendas: Operação: add");
        assertStringIncludes(graph, "Fechamento e Assinatura Final");
    });

    it("deve gerar transições de estado para integração cross-context", async () => {
        const Logistic = CalcAUY.create({ contextLabel: "logistica", salt: "s1", sensitive: false });
        const Finance = CalcAUY.create({ contextLabel: "financeiro", salt: "s2", sensitive: false });

        const frete = Logistic.from(100);
        const total = await Finance.fromExternalInstance(frete);
        const res = await total.add(20).commit();

        const graph = res.toMermaidGraph();

        assertStringIncludes(graph, "participant Ctx_logistica as Contexto: logistica");
        assertStringIncludes(graph, "participant Ctx_financeiro as Contexto: financeiro");
        
        // Transição de Logística para Financeiro
        assertStringIncludes(graph, "Ctx_logistica->>+Ctx_financeiro: Handover");
        assertStringIncludes(graph, "deactivate Ctx_logistica");

        // Eventos no Financeiro
        assertStringIncludes(graph, "Evento: reanimation_event");
        assertStringIncludes(graph, "Ingestão: 20");
        assertStringIncludes(graph, "Ctx_financeiro->>Ctx_financeiro: Operação: add");
    });

    it("deve suportar cadeias longas e agrupar ingestões consecutivas", async () => {
        const Calc = CalcAUY.create({ contextLabel: "engine", salt: "s1", sensitive: false });
        const res = await Calc.from(10).add(20).sub(5).mult(2).commit();

        const graph = res.toMermaidGraph();

        // Verifica o agrupamento de operandos iniciais
        assertStringIncludes(graph, "Ingestão de Operandos:");
        assertStringIncludes(graph, "• 10");
        assertStringIncludes(graph, "• 20");
        
        // Verifica as operações como self-calls
        assertStringIncludes(graph, "Ctx_engine->>Ctx_engine: Operação: add");
        assertStringIncludes(graph, "Ctx_engine->>Ctx_engine: Operação: sub");
        assertStringIncludes(graph, "Ctx_engine->>Ctx_engine: Operação: mul");
    });

    it("deve garantir o funcionamento do cache de saída", async () => {
        const Calc = CalcAUY.create({ contextLabel: "cache_test", salt: "s1", sensitive: false });
        const res = await Calc.from(100).commit();

        const graph1 = res.toMermaidGraph();
        const graph2 = res.toMermaidGraph();

        assertEquals(graph1 === graph2, true, "Devem ser strings idênticas vindo do cache");
    });

    it("deve sanitizar labels de contexto com caracteres especiais para aliases do Mermaid", async () => {
        const Calc = CalcAUY.create({ contextLabel: "Dep. Financeiro (Matriz!)", salt: "s1", sensitive: false });
        const res = await Calc.from(100).commit();

        const graph = res.toMermaidGraph();

        // Alias deve ser: Ctx_Dep__Financeiro__Matriz__
        assertStringIncludes(graph, "participant Ctx_Dep__Financeiro__Matriz__ as Contexto: Dep. Financeiro (Matriz!)");
        assertStringIncludes(graph, "Ingestão: 100");
    });

    describe("Metadados e Privacidade", () => {
        it("deve ocultar valores e metadados quando marcado como pii: true", async () => {
            const Calc = CalcAUY.create({ contextLabel: "privado", salt: "s1", sensitive: false });
            const res = await Calc.from(1000).setMetadata("pii", true).setMetadata("secreto", "valor").commit();

            const graph = res.toMermaidGraph();

            assertStringIncludes(graph, "Ingestão: [REDACTED]");
            assertStringIncludes(graph, "[secreto: [PII]]");
        });

        it("deve resumir metadados complexos (objetos e listas)", async () => {
            const Calc = CalcAUY.create({ contextLabel: "complexo", salt: "s1", sensitive: false });
            const res = await Calc.from(10)
                .setMetadata("lista", [1, 2, 3])
                .setMetadata("config", { a: 1 })
                .commit();

            const graph = res.toMermaidGraph();

            assertStringIncludes(graph, "[lista: [Lista: 3 itens]]");
            assertStringIncludes(graph, "[config: [Objeto]]");
        });

        it("deve exibir o timestamp formatado no padrão ISO simplificado com quebra de linha", async () => {
            const Calc = CalcAUY.create({ contextLabel: "tempo", salt: "s1", sensitive: false });
            const res = await Calc.from(50).commit();

            const graph = res.toMermaidGraph();

            // Padrão: 26-04-25 10:30 (iso)<br/>Fechamento e Assinatura Final
            assertStringIncludes(graph, "(iso)<br/>");
            
            const lines = graph.split("\n");
            const finalLine = lines.find(l => l.includes("Fechamento e Assinatura Final"));
            // Regex procura por yy-MM-dd HH:mm (iso)
            assertEquals(/\d{2}-\d{2}-\d{2} \d{2}:\d{2} \(iso\)/.test(finalLine!), true, "Deve conter timestamp no padrão ISO simplificado");
        });
    });
});
