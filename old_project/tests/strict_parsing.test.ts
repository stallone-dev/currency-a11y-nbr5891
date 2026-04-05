import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CalcAUD } from "../src/main.ts";
import { CalcAUDError } from "../src/errors.ts";

describe("Strict Parsing Rules", () => {
    describe("Allowed Inputs", () => {
        const allowedCases = [
            // Integers
            { input: 1, desc: "integer number" },
            { input: "1", desc: "integer string" },
            { input: "+100", desc: "positive integer string" },
            { input: "-100", desc: "negative integer string" },
            { input: 0, desc: "zero number" },
            { input: "0", desc: "zero string" },
            { input: "-0", desc: "negative zero string" },
            { input: 100_000, desc: "integer with separator (number)" },
            { input: "100_000", desc: "integer with separator (string)" },
            { input: "-100_000", desc: "negative integer with separator (string)" },

            // Floats / Decimals
            { input: 1.111, desc: "float number" },
            { input: "1.111", desc: "float string" },
            { input: "+100.5", desc: "positive float string" },
            { input: "-100.5", desc: "negative float string" },
            { input: ".05", desc: "decimal without leading zero" },
            { input: "-.01", desc: "negative decimal without leading zero" },

            // Scientific Notation
            { input: 1e2, desc: "scientific number positive exp" },
            { input: 1e-2, desc: "scientific number negative exp" },
            { input: "1e2", desc: "scientific string positive exp" },
            { input: "1e-2", desc: "scientific string negative exp" },
            { input: "1E2", desc: "scientific string uppercase E" },
            { input: "1E-2", desc: "scientific string uppercase E negative" },
            { input: "1e+2", desc: "scientific string explicit positive" },
            { input: "1E+2", desc: "scientific string uppercase explicit positive" },

            // BigInt
            { input: 1n, desc: "bigint literal" },
            { input: "1n", desc: "bigint string" },

            // Fractions
            { input: "1/2", desc: "simple fraction string" },
        ];

        for (const { input, desc } of allowedCases) {
            it(`should allow ${desc}: ${String(input)}`, () => {
                expect(() => CalcAUD.from(input as any)).not.toThrow();
            });
        }
    });

    describe("Forbidden Inputs", () => {
        const forbiddenCases = [
            // Spaces
            { input: " 100.00 ", desc: "string with spaces" },
            { input: " 1 ", desc: "string with spaces around integer" },
            { input: "1 ", desc: "string with trailing space" },
            { input: " 1", desc: "string with leading space" },

            // Currency Symbols
            { input: "R$ 10,00", desc: "currency symbol" },
            { input: "$10.00", desc: "dollar symbol" },

            // Locale Formats (Commas as decimals or thousands separators)
            { input: "1,000.00", desc: "US locale with thousands separator" },
            { input: "1.000,00", desc: "BR locale with thousands separator" },
            { input: "1,00", desc: "comma decimal" },

            // Invalid Formats
            { input: "10.5n", desc: "fractional bigint literal string" },
            { input: "100_", desc: "underscore at end" },
            { input: "_100", desc: "underscore at start" },
            { input: "1__00", desc: "double underscore" },
            { input: "1.2.3", desc: "multiple dots" },
            { input: "1e", desc: "incomplete scientific" },
            { input: "e2", desc: "missing mantissa" },
            { input: "1/0", desc: "division by zero (fraction)" },
            { input: "1/abc", desc: "invalid fraction denominator" },
            { input: "abc", desc: "non-numeric string" },
            { input: "", desc: "empty string" },
        ];

        for (const { input, desc } of forbiddenCases) {
            it(`should REJECT ${desc}: "${input}"`, () => {
                try {
                    CalcAUD.from(input as any);
                    throw new Error(`Should have rejected: ${input}`);
                } catch (e) {
                    expect(e).toBeInstanceOf(CalcAUDError);
                    if (input === "1/0") {
                        // Expect division by zero specific error or generic format error?
                        // Current plan puts parsing in parseStringValue.
                        // Fraction parsing likely throws if denominator is 0.
                        // Let's accept any CalcAUDError for now.
                    }
                }
            });
        }
    });
});
