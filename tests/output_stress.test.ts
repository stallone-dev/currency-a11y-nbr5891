/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0 */
import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CalcAUY } from "@calcauy";
import { LOCALES } from "@src/i18n/i18n.ts";
import type { IKatex } from "@src/core/types.ts";

// Mock minimal do KaTeX para testes de estresse sem dependência externa pesada
const mockKatex: IKatex = {
    renderToString: (latex: string) => `<span class="katex">${latex}</span>`,
};

describe("CalcAUY - Testes de Estresse de Output", () => {
    const results: Record<string, string> = {};

    it("Cenário 1: Cache de toMonetary (100.000 chamadas)", async () => {
        const ITERATIONS = 100_000;
        const output = await CalcAUY.from("1234.56").commit();
        const start = performance.now();

        for (let i = 0; i < ITERATIONS; i++) {
            const locale = i % 3 === 0 ? "pt-BR" : (i % 3 === 1 ? "en-US" : "de-DE");
            output.toMonetary({ locale: locale as any });
        }

        const end = performance.now();
        results["1_monetary_cache_hit_rate"] = `${(end - start).toFixed(4)}ms (iters: ${ITERATIONS})`;
        expect(output.toMonetary()).toContain("1.234,56");
    });

    it("Cenário 2: Verbalização A11y com AST Profunda (1_000 níveis)", async () => {
        let calc = CalcAUY.from("1");
        for (let i = 0; i < 1_000; i++) {
            calc = calc.add("1.1");
        }
        const output = await calc.commit();
        const start = performance.now();

        const verbal = output.toVerbalA11y({ locale: "pt-BR" });

        const end = performance.now();
        results["2_verbal_a11y_deep_ast"] = `${(end - start).toFixed(4)}ms (chars: ${verbal.length})`;
        expect(verbal).toContain("mais");
    });

    it("Cenário 3: Unicode & LaTeX Complexity (Aninhamento Massivo)", async () => {
        let calc = CalcAUY.from("1");
        for (let i = 0; i < 150; i++) {
            calc = CalcAUY.from("1").div(calc.add("1"));
        }
        const output = await calc.commit();
        const start = performance.now();

        const unicode = output.toUnicode();
        const latex = output.toLaTeX();

        const end = performance.now();
        results["3_render_complexity_nested"] = `${(end - start).toFixed(4)}ms (latex_len: ${latex.length})`;
        expect(unicode).toContain("÷");
        expect(latex).toContain("\\frac");
    });

    it("Cenário 4: Geração de HTML Burst (100.000 fragmentos)", async () => {
        const ITERATIONS = 100_000;
        const output = await CalcAUY.from("100.00").pow(2).div(3).commit();
        const start = performance.now();

        for (let i = 0; i < ITERATIONS; i++) {
            output.toHTML(mockKatex);
        }

        const end = performance.now();
        results["4_html_generation_burst"] = `${(end - start).toFixed(4)}ms (iters: ${ITERATIONS})`;
    });

    it("Cenário 5: Slicing de Alta Precisão (100_000 fatias)", async () => {
        const SLICES = 100_000;
        const output = await CalcAUY.from("1000000.00").commit();
        const start = performance.now();

        const slices = output.toSlice(SLICES, { decimalPrecision: 10 });

        const end = performance.now();
        results["5_high_precision_slicing"] = `${(end - start).toFixed(4)}ms (slices: ${SLICES})`;
        expect(slices.length).toBe(SLICES);
    });

    it("Cenário 6: Consolidação toJSON Completa (100_000 objetos)", async () => {
        const ITERATIONS = 100_000;
        const output = await CalcAUY.from("99.99").mult("1.15").commit();
        const start = performance.now();

        for (let i = 0; i < ITERATIONS; i++) {
            output.toJSON();
        }

        const end = performance.now();
        results["6_to_json_consolidation"] = `${(end - start).toFixed(4)}ms (iters: ${ITERATIONS})`;
    });

    it("Cenário 7: Troca de Locale em Massa (Todos os suportados)", async () => {
        const locales = Object.keys(LOCALES);
        const output = await CalcAUY.from("1234567.89").commit();
        const start = performance.now();

        for (let i = 0; i < 10_000; i++) {
            for (const loc of locales) {
                output.toVerbalA11y({ locale: loc as any });
                output.toMonetary({ locale: loc as any });
            }
        }

        const end = performance.now();
        results["7_locale_switching_burst"] = `${(end - start).toFixed(4)}ms (switches: ${locales.length * 10_000})`;
    });

    it("Cenário 8: Custom Output Processor Pressure", async () => {
        const ITERATIONS = 100_000;
        const output = await CalcAUY.from("10").add("20").commit();
        const start = performance.now();

        for (let i = 0; i < ITERATIONS; i++) {
            output.toCustomOutput((ctx) => {
                return `Audit: ${ctx.audit.unicode} | Result: ${ctx.result.n}`;
            });
        }

        const end = performance.now();
        results["8_custom_processor_stress"] = `${(end - start).toFixed(4)}ms (iters: ${ITERATIONS})`;
    });

    it("Cenário 9: Image Buffer SVG Generation (100_000 buffers)", async () => {
        const ITERATIONS = 100_000;
        const output = await CalcAUY.from("10").div("3").commit();
        const start = performance.now();

        for (let i = 0; i < ITERATIONS; i++) {
            output.toImageBuffer(mockKatex);
        }

        const end = performance.now();
        results["9_image_buffer_svg_stress"] = `${(end - start).toFixed(4)}ms (iters: ${ITERATIONS})`;
    });

    it("Consolidação de Resultados de Output", () => {
        console.log("\n=== RELATÓRIO DE ESTRESSE DE OUTPUT (CALC-AUY) ===");
        console.table(results);
    });
});
