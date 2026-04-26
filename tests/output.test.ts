import { beforeEach, describe, it } from "@std/testing/bdd";
import { assert, assertEquals, assertStringIncludes, assertThrows } from "@std/assert";
import { CalcAUY } from "@calcauy";
import { CalcAUYError } from "@src/core/errors.ts";
import { getSubLogger } from "@src/utils/logger.ts"; // Import for mocking
import { securityPolicy } from "@src/utils/sanitizer.ts"; // Import for mocking
import { CalcAUYCustomOutput, CalcAUYCustomOutputContext, CalcAUYOutput } from "@src/output.ts"; // Import CalcAUYOutput and its interfaces

import { htmlProcessor } from "@processor/html";
import { imageBufferProcessor } from "@processor/image-buffer";

// Type for valid log levels
type LogLevel = "trace" | "debug" | "info" | "warning" | "error" | "fatal";

// Mock logger.isEnabledFor for testing logging calls.
const outputLogger = getSubLogger("output"); // Use output sublogger
const originalIsEnabledFor = outputLogger.isEnabledFor;
const originalsecurityPolicySensitive = securityPolicy.sensitive; // Store original state

describe("CalcAUYOutput - HTML & Image Generation (Extracted Processors)", () => {
    // Note: mockKatex is no longer needed if we use the real htmlProcessor which imports katex,
    // but for unit tests we might want to keep mocking if we don't want real dependencies.
    // However, the instruction said to use real dependencies in processor.
    // I'll use real processors in tests to validate the extraction.

    it("toHTML (via CustomOutput) deve gerar HTML com CSS e rastro de auditoria", async () => {
        const res = await CalcAUY.from(10).add(5).commit({ roundStrategy: "NBR5891" });
        const html = res.toCustomOutput(htmlProcessor);

        assertStringIncludes(html, '<div class="calc-auy-result"');
        assertStringIncludes(html, 'aria-label="10 mais 5 é igual a 15 vírgula 00');
        assertStringIncludes(html, "<style>");
        assertStringIncludes(html, ".calc-auy-result { margin: 1em 0; overflow-x: auto; }");
        assertStringIncludes(html, "\\text{round}_{\\text{NBR-5891}}(10 + 5, 2) = 15.00");
    });

    it("toImageBuffer (via CustomOutput) deve gerar um buffer contendo SVG com rastro e metadados", async () => {
        const res = await CalcAUY.from(10).add(5).commit({ roundStrategy: "NBR5891" });
        const buffer = res.toCustomOutput(imageBufferProcessor);
        const svg = new TextDecoder().decode(buffer);

        assertStringIncludes(svg, "<svg");
        assertStringIncludes(svg, 'viewBox="0 0');
        assertStringIncludes(svg, "<foreignObject");
        assertStringIncludes(svg, "\\text{round}_{\\text{NBR-5891}}(10 + 5, 2) = 15.00");
    });

    it("toImageBuffer deve ajustar altura para frações e raízes", async () => {
        const res = await CalcAUY.from(10).div(3).commit({ roundStrategy: "HALF_UP" });
        const buffer = res.toCustomOutput(imageBufferProcessor);
        const svg = new TextDecoder().decode(buffer);

        const heightMatch = svg.match(/height="(\d+)"/);
        const height = heightMatch ? parseInt(heightMatch[1]) : 0;
        assertEquals(height >= 80, true);
    });
});

describe("CalcAUYOutput - Output Methods and Customization", () => {
    // Restore mocks and logging policy after each test
    beforeEach(() => {
        outputLogger.isEnabledFor = originalIsEnabledFor;
        securityPolicy.sensitive = originalsecurityPolicySensitive; // Reset logging policy
    });

    it("deve retornar o resultado racional bruto como objeto {n, d}", async () => {
        const res = await CalcAUY.from(10).div(3).commit();
        assertEquals(res.toRawInternalNumber(), { n: 10n, d: 3n });
    });

    it("deve formatar o resultado como valor monetário padrão (pt-BR, BRL)", async () => {
        const res = await CalcAUY.from(1234.56).commit();
        assertEquals(res.toMonetary({ decimalPrecision: 2 }), "R$ 1.234,56");
    });

    it("deve formatar o resultado como valor monetário com opções customizadas (en-US, USD, 0 casas decimais)", async () => {
        const res = await CalcAUY.from(1234.567).commit();
        // Use a known locale for consistent output in different environments
        assertEquals(res.toMonetary({ locale: "en-US", currency: "USD", decimalPrecision: 0 }), "$1,235");
        assertEquals(res.toMonetary({ locale: "en-US", currency: "EUR", decimalPrecision: 2 }), "€1,234.57");
    });

    it("toJSON: deve retornar a representação JSON com as chaves padrão e excluir as chaves de output", async () => {
        const res = await CalcAUY.from(10).add(5).commit();
        const json: any = JSON.parse(res.toJSON()); // JSON.parse here

        // Check for default keys
        assert(json.toStringNumber);
        assert(json.toScaledBigInt);
        assert(json.toMonetary);
        assert(json.toLaTeX);
        assert(json.toUnicode);
        assert(json.toVerbalA11y);
        assert(json.toAuditTrace);

        // Check for excluded keys
        assert(json.toJSON === undefined); // These methods are not included by default
        assert(json.toCustomOutput === undefined);
        assert(json.toHTML === undefined);
        assert(json.toImageBuffer === undefined);

        // Verify some values
        assertEquals(json.toStringNumber, "15.00");
    });

    it("deve permitir processamento de saída customizado via processor", async () => {
        const res = await CalcAUY.from(10).div(3).commit();

        interface CustomOutput {
            numerator: string;
            denominator: string;
            latexFormula: string;
            decimal: string;
        }

        const customProcessor: CalcAUYCustomOutput<CustomOutput> = function (
            this: CalcAUYOutput,
            context: CalcAUYCustomOutputContext,
        ): CustomOutput {
            return {
                numerator: context.result.n.toString(),
                denominator: context.result.d.toString(),
                latexFormula: context.audit.latex,
                decimal: context.methods.toStringNumber(context.options),
            };
        };

        const customResult = res.toCustomOutput(customProcessor);

        assertEquals(customResult.numerator, "10");
        assertEquals(customResult.denominator, "3");
        assertStringIncludes(customResult.latexFormula, "\\text{round}_{\\text{NBR-5891}}(\\frac{10}{3}, 2) = 3.33"); // Corrected LaTeX string
        assertEquals(customResult.decimal, "3.33");
    });

    it("deve chamar logger.info quando um método de output é invocado e o info está habilitado", async () => {
        let infoCalled = false;
        outputLogger.isEnabledFor = (level: LogLevel) => {
            if (level === "info") {
                infoCalled = true;
                return true;
            }
            return false;
        };

        (await CalcAUY.from(10).commit()).toMonetary();
        assertEquals(infoCalled, true, "logger.info should have been called for toMonetary");

        infoCalled = false; // Reset
        (await CalcAUY.from(10).commit()).toLaTeX();
        assertEquals(infoCalled, true, "logger.info should have been called for toLaTeX");
    });
});
