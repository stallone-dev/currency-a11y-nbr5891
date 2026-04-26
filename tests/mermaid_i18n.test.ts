/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { describe, it } from "@std/testing/bdd";
import { assertStringIncludes } from "@std/assert";
import { CalcAUY } from "@calcauy";
import { LOCALES } from "@src/i18n/i18n.ts";
import type { CalcAUYLocale } from "@src/core/types.ts";

describe("toMermaidGraph - Internacionalização (i18n)", () => {
    const locales = Object.keys(LOCALES) as CalcAUYLocale[];

    locales.forEach((localeCode) => {
        const loc = LOCALES[localeCode];

        it(`deve traduzir corretamente o diagrama para o idioma: ${localeCode}`, async () => {
            const Logistic = CalcAUY.create({ contextLabel: "logistics", salt: "s1", sensitive: false });
            const Finance = CalcAUY.create({ contextLabel: "finance", salt: "s2", sensitive: false });

            // Cenário: 100 (Logistics) -> Finance + 50
            const start = Logistic.from(100);
            const rastro = await start.hibernate();

            // É preciso informar o salt original ("s1") para hidratar com sucesso
            const rehydrated = await Finance.hydrate(rastro, { salt: "s1" });
            const final = await rehydrated.add(50)
                .setMetadata("lista", [1, 2, 3])
                .setMetadata("config", { a: 1 })
                .commit();

            const graph = final.toMermaidGraph({ locale: localeCode });

            // 1. Valida o título do participante (Context)
            assertStringIncludes(graph, `${loc.mermaid.context}: logistics`);
            assertStringIncludes(graph, `${loc.mermaid.context}: finance`);

            // 2. Valida o Handover
            assertStringIncludes(graph, `${loc.mermaid.handover} (Sig:`);

            // 3. Valida a Ingestão (Única ou Múltipla)
            assertStringIncludes(graph, `${loc.mermaid.ingestion}: 50`);

            // 4. Valida a Operação
            assertStringIncludes(graph, `${loc.mermaid.operation}: add`);

            // 5. Valida o Fechamento e Signature
            assertStringIncludes(graph, loc.mermaid.closing);
            assertStringIncludes(graph, `${loc.mermaid.signature}: (Sig:`);

            // 6. Valida o Timestamp (ISO)
            assertStringIncludes(graph, "(iso)<br/>");

            // 7. Valida Metadados Traduzidos (Simplificação)
            assertStringIncludes(graph, loc.mermaid.objectLabel);
            assertStringIncludes(graph, loc.mermaid.listTemplate.replace("{n}", "3"));
        });
    });
});
