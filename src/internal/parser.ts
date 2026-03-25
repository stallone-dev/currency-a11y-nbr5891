import { INTERNAL_CALCULATION_PRECISION, INTERNAL_SCALE_FACTOR } from "../constants.ts";
import { CurrencyNBRError } from "../errors.ts";

// Regex Definitions for Strict Validation
const DIGITS = String.raw`\d+(?:_\d+)*`;
const SIGN = String.raw`[+-]?`;
const EXP = String.raw`[eE]${SIGN}${DIGITS}`;

// 1. BigInt: "1n", "-10n"
const RE_BIGINT = new RegExp(String.raw`^${SIGN}${DIGITS}n$`);

// 2. Fraction: "1/2", "-1/3", "+5/2"
const RE_FRACTION = new RegExp(String.raw`^${SIGN}${DIGITS}\/${SIGN}${DIGITS}$`);

// 3. Scientific: "1e2", "1.5e-2", ".5e2"
const RE_SCIENTIFIC = new RegExp(String.raw`^${SIGN}(?:(?:${DIGITS}(?:\.(?:${DIGITS})?)?)|(?:\.(?:${DIGITS})))${EXP}$`);

// 4. Decimal/Integer: "1", "1.5", ".5", "-100"
// Note: We check Scientific first because Decimal regex matches the prefix of scientific.
const RE_DECIMAL = new RegExp(String.raw`^${SIGN}(?:(?:${DIGITS}(?:\.(?:${DIGITS})?)?)|(?:\.(?:${DIGITS})))$`);

/**
 * Analisa uma string numérica estritamente e a converte para um BigInt na escala interna.
 * Rejeita qualquer formato não explicitamente permitido (espaços, vírgulas, símbolos).
 *
 * @param value A string representando o número.
 * @returns O valor BigInt escalado.
 * @throws CurrencyNBRError se o formato for inválido.
 */
export function parseStringValue(value: string): bigint {
    // 1. Strict Format Check
    // We do NOT trim. Spaces are forbidden.

    if (RE_BIGINT.test(value)) {
        return parseBigIntLiteral(value);
    }
    if (RE_FRACTION.test(value)) {
        return parseFractionLiteral(value);
    }
    if (RE_SCIENTIFIC.test(value)) {
        return parseScientificLiteral(value);
    }
    if (RE_DECIMAL.test(value)) {
        // Parse as scientific with exp=0 for unified logic
        return parseScientificLiteral(value + "e0");
    }

    throw new CurrencyNBRError({
        type: "invalid-numeric-format",
        title: "Erro de Parsing Numérico",
        detail: `O valor fornecido não corresponde a nenhum formato numérico permitido (Inteiro, Decimal, Científico, Fração ou BigInt estrito).`,
        operation: "parse",
    });
}

function removeUnderscores(s: string): string {
    return s.replace(/_/g, "");
}

function parseBigIntLiteral(value: string): bigint {
    // Remove 'n' and underscores
    const clean = removeUnderscores(value.slice(0, -1)); // Remove last 'n'
    return BigInt(clean) * INTERNAL_SCALE_FACTOR;
}

function parseFractionLiteral(value: string): bigint {
    const parts = value.split("/");
    const numStr = removeUnderscores(parts[0]);
    const denStr = removeUnderscores(parts[1]);

    const num = BigInt(numStr);
    const den = BigInt(denStr);

    if (den === 0n) {
        throw new CurrencyNBRError({
            type: "division-by-zero",
            title: "Erro de Parsing de Fração",
            detail: "Denominador da fração não pode ser zero.",
            operation: "parse",
        });
    }

    // Result = (num * SCALE) / den
    // Rounding Half-Up (Away From Zero) logic

    const finalSign = (num < 0n) !== (den < 0n) ? -1n : 1n;
    const absNum = num < 0n ? -num : num;
    const absDen = den < 0n ? -den : den;

    const absScaled = absNum * INTERNAL_SCALE_FACTOR;
    const absQuotient = absScaled / absDen;
    const absRem = absScaled % absDen;

    if (2n * absRem >= absDen) {
        return (absQuotient + 1n) * finalSign;
    }
    return absQuotient * finalSign;
}

function parseScientificLiteral(value: string): bigint {
    // 1e2, 1.5e-2, .5e2
    const lower = value.toLowerCase();
    const parts = lower.split("e");
    let mantissaStr = removeUnderscores(parts[0]);
    const expStr = removeUnderscores(parts[1]);

    let exp = BigInt(expStr);

    // Parse Mantissa
    let mantissaInt: bigint;
    let mantissaDecimals = 0;

    if (mantissaStr.includes(".")) {
        const [intPart, decPart] = mantissaStr.split(".");
        mantissaDecimals = decPart.length;
        mantissaStr = intPart + decPart;
    }

    mantissaInt = BigInt(mantissaStr || "0"); // Handle ".5" -> "" + "5"

    // Formula: mantissaInt * 10^(exp + INTERNAL_CALCULATION_PRECISION - mantissaDecimals)
    const power = exp + BigInt(INTERNAL_CALCULATION_PRECISION) - BigInt(mantissaDecimals);

    if (power >= 0n) {
        return mantissaInt * (10n ** power);
    } else {
        // We need to divide to handle negative power
        const denominator = 10n ** (-power);

        // Rounding logic (Round Half Away From Zero)
        const absMantissa = mantissaInt < 0n ? -mantissaInt : mantissaInt;
        const sign = mantissaInt < 0n ? -1n : 1n;

        const quotient = absMantissa / denominator;
        const remainder = absMantissa % denominator;

        if (2n * remainder >= denominator) {
            return (quotient + 1n) * sign;
        }
        return quotient * sign;
    }
}
