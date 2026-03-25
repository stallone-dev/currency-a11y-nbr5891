// deno-lint-ignore-file ban-unused-ignore default-param-last

import { calculateBigIntPower, calculateFractionalPower } from "./internal/math_utils.ts";
import { parseStringValue } from "./internal/parser.ts";
import { toSuperscript } from "./internal/superscript.ts";
import { wrapLaTeX, wrapUnicode } from "./internal/wrappers.ts";
import { CurrencyNBROutput } from "./output.ts";
import { DEFAULT_DISPLAY_PRECISION, INTERNAL_SCALE_FACTOR } from "./constants.ts";
import type { CurrencyNBROutputOptions } from "./output_helpers/options.ts";
import { VERBAL_TOKENS } from "./output_helpers/i18n.ts";
import { CurrencyNBRError, logFatal } from "./errors.ts";
import { getLogger } from "@logtape";

/**
 * Representa qualquer valor que possa ser convertido em um montante auditável.
 */
export type CurrencyNBRAllowedValue = string | number | bigint | CurrencyNBR;

/**
 * Classe principal para cálculos financeiros precisos, auditáveis e acessíveis.
 */
export class CurrencyNBR {
    private readonly accumulatedValue: bigint;
    private readonly activeTermValue: bigint;
    private readonly accumulatedExpression: string;
    private readonly activeTermExpression: string;
    private readonly accumulatedVerbal: string;
    private readonly activeTermVerbal: string;
    private readonly accumulatedUnicode: string;
    private readonly activeTermUnicode: string;

    private constructor(
        accumulatedValue: bigint,
        activeTermValue: bigint,
        accumulatedExpression: string,
        activeTermExpression: string,
        accumulatedVerbal: string,
        activeTermVerbal: string,
        accumulatedUnicode: string,
        activeTermUnicode: string,
    ) {
        this.accumulatedValue = accumulatedValue;
        this.activeTermValue = activeTermValue;
        this.accumulatedExpression = accumulatedExpression;
        this.activeTermExpression = activeTermExpression;
        this.accumulatedVerbal = accumulatedVerbal;
        this.activeTermVerbal = activeTermVerbal;
        this.accumulatedUnicode = accumulatedUnicode;
        this.activeTermUnicode = activeTermUnicode;
    }

    public static from(value: CurrencyNBRAllowedValue): CurrencyNBR {
        const start = performance.now();
        if (value instanceof CurrencyNBR) { return value; }

        try {
            // Validação rigorosa em runtime para tipos não suportados
            const isValidType = value !== null
                && value !== undefined
                && (typeof value === "string" || typeof value === "number" || typeof value === "bigint");

            const isInvalidNumber = typeof value === "number" && !Number.isFinite(value);

            if (!isValidType || isInvalidNumber) {
                throw new CurrencyNBRError({
                    type: "invalid-currency-format",
                    title: "Tipo de Dado Inválido",
                    detail: `O tipo '${typeof value}' não é um formato de moeda suportado para inicialização.`,
                    operation: "from",
                });
            }

            const rawValue = typeof value === "bigint"
                ? value * INTERNAL_SCALE_FACTOR
                : parseStringValue(value.toString());
            const initialExpression = value.toString();
            const initialVerbal = initialExpression;
            const initialUnicode = initialExpression;

            const result = new CurrencyNBR(
                0n,
                rawValue,
                "",
                initialExpression,
                "",
                initialVerbal,
                "",
                initialUnicode,
            );

            const end = performance.now();
            getLogger(["currency-nbr-a11y", "input"]).debug("Input initialized {*}", {
                calcTime: end - start,
                value: String(value),
                type: typeof value,
                internalValue: rawValue.toString(),
            });

            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "from", value: String(value) });
            }
            throw e;
        }
    }

    public add(value: CurrencyNBRAllowedValue): CurrencyNBR {
        const start = performance.now();
        try {
            const other = CurrencyNBR.from(value);
            const otherValue = other.accumulatedValue + other.activeTermValue;
            const newAccumulatedValue = this.accumulatedValue + this.activeTermValue;

            const nextActiveExpr = wrapLaTeX(other.getFullLaTeXExpression());
            const nextActiveUnicode = wrapUnicode(other.getFullUnicodeExpression());
            const nextActiveVerbal = other.accumulatedVerbal
                ? `${VERBAL_TOKENS.GRP_START}${other.getFullVerbalExpression()}${VERBAL_TOKENS.GRP_END}`
                : other.activeTermVerbal;

            const result = new CurrencyNBR(
                newAccumulatedValue,
                otherValue,
                this.getFullLaTeXExpression(),
                nextActiveExpr,
                this.getFullVerbalExpression(),
                nextActiveVerbal,
                this.getFullUnicodeExpression(),
                nextActiveUnicode,
            );
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "add"]).debug("Addition performed {*}", {
                calcTime: end - start,
                mathState: {
                    latex: result.getFullLaTeXExpression(),
                    unicode: result.getFullUnicodeExpression(),
                },
                currentAccumulatedResult: (result.accumulatedValue + result.activeTermValue).toString(),
                activeTerm: result.activeTermValue.toString(),
                addingValue: otherValue.toString(),
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "add", value: String(value) });
            }
            throw e;
        }
    }

    public sub(value: CurrencyNBRAllowedValue): CurrencyNBR {
        const start = performance.now();
        try {
            const other = CurrencyNBR.from(value);
            const otherValue = other.accumulatedValue + other.activeTermValue;
            const newAccumulatedValue = this.accumulatedValue + this.activeTermValue;

            const nextActiveExpr = `- ${wrapLaTeX(other.getFullLaTeXExpression())}`;
            const nextActiveUnicode = `- ${wrapUnicode(other.getFullUnicodeExpression())}`;
            const nextActiveVerbal = `${VERBAL_TOKENS.SUB}${
                other.accumulatedVerbal
                    ? `${VERBAL_TOKENS.GRP_START}${other.getFullVerbalExpression()}${VERBAL_TOKENS.GRP_END}`
                    : other.activeTermVerbal
            }`;

            const result = new CurrencyNBR(
                newAccumulatedValue,
                -otherValue,
                this.getFullLaTeXExpression(),
                nextActiveExpr,
                this.getFullVerbalExpression(),
                nextActiveVerbal,
                this.getFullUnicodeExpression(),
                nextActiveUnicode,
            );
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "sub"]).debug("Subtraction performed {*}", {
                calcTime: end - start,
                mathState: {
                    latex: result.getFullLaTeXExpression(),
                    unicode: result.getFullUnicodeExpression(),
                },
                currentAccumulatedResult: (result.accumulatedValue + result.activeTermValue).toString(),
                activeTerm: result.activeTermValue.toString(),
                subtrahend: otherValue.toString(),
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "sub", value: String(value) });
            }
            throw e;
        }
    }

    public mult(value: CurrencyNBRAllowedValue): CurrencyNBR {
        const start = performance.now();
        try {
            const other = CurrencyNBR.from(value);
            const otherValue = other.accumulatedValue + other.activeTermValue;
            const product = this.activeTermValue * otherValue;

            // Metade da nossa escala de 10^12 (ou seja, 5 * 10^11)
            const halfScale = INTERNAL_SCALE_FACTOR / 2n;

            // Ajuste de sinal: se o produto for positivo, somamos. Se for negativo, subtraímos.
            const adjustment = product >= 0n ? halfScale : -halfScale;

            // A divisão agora arredonda para a 12ª casa mais próxima em vez de simplesmente truncar
            const nextActiveValue = (product + adjustment) / INTERNAL_SCALE_FACTOR;

            const nextActiveExpr = `${wrapLaTeX(this.activeTermExpression)} \\times ${
                wrapLaTeX(other.getFullLaTeXExpression())
            }`;
            const nextActiveVerbal = `${this.activeTermVerbal}${VERBAL_TOKENS.MULT}${other.getFullVerbalExpression()}`;
            const nextActiveUnicode = `${wrapUnicode(this.activeTermUnicode)} × ${
                wrapUnicode(other.getFullUnicodeExpression())
            }`;

            const result = new CurrencyNBR(
                this.accumulatedValue,
                nextActiveValue,
                this.accumulatedExpression,
                nextActiveExpr,
                this.accumulatedVerbal,
                nextActiveVerbal,
                this.accumulatedUnicode,
                nextActiveUnicode,
            );
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "mult"]).debug("Multiplication performed {*}", {
                calcTime: end - start,
                mathState: {
                    latex: result.getFullLaTeXExpression(),
                    unicode: result.getFullUnicodeExpression(),
                },
                currentAccumulatedResult: (result.accumulatedValue + result.activeTermValue).toString(),
                activeTerm: result.activeTermValue.toString(),
                multiplier: otherValue.toString(),
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "mult", value: String(value) });
            }
            throw e;
        }
    }

    public div(value: CurrencyNBRAllowedValue): CurrencyNBR {
        const start = performance.now();
        try {
            const other = CurrencyNBR.from(value);
            const otherValue = other.accumulatedValue + other.activeTermValue;
            if (otherValue === 0n) {
                throw new CurrencyNBRError({
                    type: "division-by-zero",
                    title: "Operação Matemática Inválida",
                    detail: "Tentativa de divisão por um montante acumulado igual a zero.",
                    operation: "division",
                    latex: `\\frac{${this.activeTermExpression}}{0}`,
                    unicode: `${this.activeTermUnicode} ÷ 0`,
                });
            }
            const numerator = this.activeTermValue * INTERNAL_SCALE_FACTOR;

            // Capturamos a metade exata do divisor para fazer o arredondamento na 12ª casa
            const halfDenominator = otherValue / 2n;

            // O ajuste do sinal garante que o arredondamento funcione para números negativos
            const adjustment = (this.activeTermValue < 0n) === (otherValue < 0n)
                ? halfDenominator
                : -halfDenominator;

            const nextActiveValue = (numerator + adjustment) / otherValue;

            const nextActiveExpr = `\\frac{${this.activeTermExpression}}{${other.getFullLaTeXExpression()}}`;
            const nextActiveVerbal = `${this.activeTermVerbal}${VERBAL_TOKENS.DIV}${other.getFullVerbalExpression()}`;
            const nextActiveUnicode = `${wrapUnicode(this.activeTermUnicode)} ÷ ${
                wrapUnicode(other.getFullUnicodeExpression())
            }`;

            const result = new CurrencyNBR(
                this.accumulatedValue,
                nextActiveValue,
                this.accumulatedExpression,
                nextActiveExpr,
                this.accumulatedVerbal,
                nextActiveVerbal,
                this.accumulatedUnicode,
                nextActiveUnicode,
            );
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "div"]).debug("Division performed {*}", {
                calcTime: end - start,
                mathState: {
                    latex: result.getFullLaTeXExpression(),
                    unicode: result.getFullUnicodeExpression(),
                },
                currentAccumulatedResult: (result.accumulatedValue + result.activeTermValue).toString(),
                activeTerm: result.activeTermValue.toString(),
                divisor: otherValue.toString(),
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "div", value: String(value) });
            }
            throw e;
        }
    }

    public divInt(value: CurrencyNBRAllowedValue, options: CurrencyNBROutputOptions = {}): CurrencyNBR {
        const strategy = options.modStrategy ?? "euclidean";
        const start = performance.now();
        try {
            const other = CurrencyNBR.from(value);
            const otherValue = other.accumulatedValue + other.activeTermValue;
            if (otherValue === 0n) {
                throw new CurrencyNBRError({
                    type: "division-by-zero",
                    title: "Operação Matemática Inválida",
                    detail: "Tentativa de divisão inteira por um montante acumulado igual a zero.",
                    operation: "divInt",
                    latex: `\\lfloor \\frac{${this.activeTermExpression}}{0} \\rfloor`,
                    unicode: `⌊${this.activeTermUnicode} ÷ 0⌋`,
                });
            }

            let quotient: bigint;
            let latexWrapper: [string, string];
            let unicodeWrapper: [string, string];
            let verbalOp: string;

            if (strategy === "euclidean") {
                // Euclidean (Floor Division) Logic
                quotient = this.activeTermValue / otherValue;
                const remainder = this.activeTermValue % otherValue;

                if (remainder !== 0n && ((this.activeTermValue < 0n) !== (otherValue < 0n))) {
                    quotient -= 1n;
                }
                latexWrapper = ["\\lfloor", "\\rfloor"];
                unicodeWrapper = ["⌊", "⌋"];
                verbalOp = VERBAL_TOKENS.DIV_INT;
            } else {
                // Truncated (Native) Logic
                quotient = this.activeTermValue / otherValue;
                latexWrapper = ["\\text{trunc}\\left(", "\\right)"];
                unicodeWrapper = ["trunc(", ")"];
                verbalOp = " trunc "; // Distinct verbal for truncate? Or reuse DIV_INT? Let's use "trunc" for clarity if strategy is explicit.
            }

            const nextActiveValue = quotient * INTERNAL_SCALE_FACTOR;

            const nextActiveExpr = `${latexWrapper[0]} \\frac{${this.activeTermExpression}}{${other.getFullLaTeXExpression()}} ${latexWrapper[1]}`;
            const nextActiveVerbal = `${this.activeTermVerbal}${verbalOp}${other.getFullVerbalExpression()}`;
            const nextActiveUnicode = `${unicodeWrapper[0]}${this.activeTermUnicode} ÷ ${other.getFullUnicodeExpression()}${unicodeWrapper[1]}`;

            const result = new CurrencyNBR(
                this.accumulatedValue,
                nextActiveValue,
                this.accumulatedExpression,
                nextActiveExpr,
                this.accumulatedVerbal,
                nextActiveVerbal,
                this.accumulatedUnicode,
                nextActiveUnicode,
            );
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "divInt"]).debug("Integer division performed {*}", {
                calcTime: end - start,
                strategy,
                mathState: {
                    latex: result.getFullLaTeXExpression(),
                    unicode: result.getFullUnicodeExpression(),
                },
                currentAccumulatedResult: (result.accumulatedValue + result.activeTermValue).toString(),
                activeTerm: result.activeTermValue.toString(),
                divisor: otherValue.toString(),
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "divInt", value: String(value), options });
            }
            throw e;
        }
    }

    public mod(value: CurrencyNBRAllowedValue, options: CurrencyNBROutputOptions = {}): CurrencyNBR {
        const strategy = options.modStrategy ?? "euclidean";
        const start = performance.now();
        try {
            const other = CurrencyNBR.from(value);
            const otherValue = other.accumulatedValue + other.activeTermValue;
            if (otherValue === 0n) {
                throw new CurrencyNBRError({
                    type: "division-by-zero",
                    title: "Operação Matemática Inválida",
                    detail: "Tentativa de cálculo de módulo por zero.",
                    operation: "mod",
                    latex: `${this.activeTermExpression} \\pmod{0}`,
                    unicode: `${this.activeTermUnicode} mod 0`,
                });
            }

            let nextActiveValue: bigint;

            if (strategy === "euclidean") {
                // Módulo Euclidiano: garante que o resto seja sempre positivo
                // Fórmula: ((a % n) + n) % n
                const rawMod = this.activeTermValue % otherValue;
                const absDivisor = otherValue < 0n ? -otherValue : otherValue;
                nextActiveValue = ((rawMod % absDivisor) + absDivisor) % absDivisor;
            } else {
                // Resto Truncado (Padrão JS/C#/Java)
                nextActiveValue = this.activeTermValue % otherValue;
            }

            const opSymbol = strategy === "euclidean" ? "mod" : "%";
            const latexOp = strategy === "euclidean" ? "\\bmod" : "\\text{ rem }";

            const nextActiveExpr = `${this.activeTermExpression} ${latexOp} ${other.getFullLaTeXExpression()}`;
            const nextActiveVerbal = `${this.activeTermVerbal}${
                strategy === "euclidean" ? VERBAL_TOKENS.MOD : " resto "
            }${other.getFullVerbalExpression()}`;
            const nextActiveUnicode = `${this.activeTermUnicode} ${opSymbol} ${other.getFullUnicodeExpression()}`;

            const result = new CurrencyNBR(
                this.accumulatedValue,
                nextActiveValue,
                this.accumulatedExpression,
                nextActiveExpr,
                this.accumulatedVerbal,
                nextActiveVerbal,
                this.accumulatedUnicode,
                nextActiveUnicode,
            );
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "mod"]).debug("Modulo performed {*}", {
                calcTime: end - start,
                strategy,
                mathState: {
                    latex: result.getFullLaTeXExpression(),
                    unicode: result.getFullUnicodeExpression(),
                },
                currentAccumulatedResult: (result.accumulatedValue + result.activeTermValue).toString(),
                activeTerm: result.activeTermValue.toString(),
                divisor: otherValue.toString(),
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "mod", value: String(value), options });
            }
            throw e;
        }
    }

    public pow(exponent: string | number): CurrencyNBR {
        const start = performance.now();
        try {
            const baseValue = this.activeTermValue;
            const baseExpr = wrapLaTeX(this.activeTermExpression);
            const baseVerbal = this.activeTermVerbal;
            const baseUnicode = wrapUnicode(this.activeTermUnicode);

            let nextExpr: string;
            let nextVerbal: string;
            let nextUnicode: string;
            let nextValue: bigint;

            const expStr = exponent.toString();
            if (expStr.includes("/")) {
                const parts = expStr.split("/");

                // 1. Validação rigorosa do formato fracionário (Prevenindo o "1 / 2 / 3")
                if (parts.length !== 2) {
                    throw new CurrencyNBRError({
                        type: "invalid-fractional-exponent",
                        title: "Expoente Fracionário Inválido",
                        detail:
                            `O expoente '${expStr}' é inválido. Um expoente fracionário deve conter exatamente um numerador e um denominador separados por uma única barra (ex: '1/2').`,
                        operation: "pow",
                    });
                }

                // 2. Só agora tentamos converter para BigInt
                // Usamos try/catch aqui caso o usuário mande algo como "1 / abc"
                let num: bigint;
                let den: bigint;
                try {
                    num = BigInt(parts[0].trim());
                    den = BigInt(parts[1].trim());
                } catch {
                    throw new CurrencyNBRError({
                        type: "invalid-exponent-value",
                        title: "Valor de Expoente Inválido",
                        detail: `Não foi possível converter as partes do expoente '${expStr}' para números inteiros.`,
                        operation: "pow",
                    });
                }
                nextValue = calculateFractionalPower(baseValue, num, den, INTERNAL_SCALE_FACTOR);

                const denSup = toSuperscript(den.toString());
                const numSup = num === 1n ? "" : toSuperscript(num.toString());

                nextExpr = num === 1n ? `\\sqrt[${den}]{${baseExpr}}` : `\\sqrt[${den}]{${baseExpr}^{${num}}}`;
                nextVerbal = `${VERBAL_TOKENS.ROOT_IDX}${den}${VERBAL_TOKENS.ROOT_OF}${baseVerbal}${
                    num === 1n ? "" : VERBAL_TOKENS.POW + num
                }`;
                nextUnicode = `${denSup === "²" ? "" : denSup}√(${baseUnicode}${numSup})`;
            } else {
                const exp = BigInt(expStr);
                const expSup = toSuperscript(expStr);

                nextExpr = `{${baseExpr}}^{${expStr}}`;
                nextVerbal = `${baseVerbal}${VERBAL_TOKENS.POW}${expStr}`;
                nextUnicode = `${baseUnicode}${expSup}`;

                if (exp === 0n) { nextValue = INTERNAL_SCALE_FACTOR; }
                else if (exp > 0n) {
                    nextValue = calculateBigIntPower(baseValue, exp)
                        / calculateBigIntPower(INTERNAL_SCALE_FACTOR, exp - 1n);
                } else {
                    const denVal = calculateBigIntPower(baseValue, -exp)
                        / calculateBigIntPower(INTERNAL_SCALE_FACTOR, (-exp) - 1n);
                    nextValue = (INTERNAL_SCALE_FACTOR * INTERNAL_SCALE_FACTOR) / denVal;
                }
            }
            const result = new CurrencyNBR(
                this.accumulatedValue,
                nextValue,
                this.accumulatedExpression,
                nextExpr,
                this.accumulatedVerbal,
                nextVerbal,
                this.accumulatedUnicode,
                nextUnicode,
            );
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "pow"]).debug("Power/Root operation performed {*}", {
                calcTime: end - start,
                mathState: {
                    latex: result.getFullLaTeXExpression(),
                    unicode: result.getFullUnicodeExpression(),
                },
                exponent: expStr,
                base: baseValue.toString(),
                result: result.activeTermValue.toString(),
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "pow", exponent });
            }
            throw e;
        }
    }

    public group(): CurrencyNBR {
        const start = performance.now();
        try {
            const totalValue = this.accumulatedValue + this.activeTermValue;
            const groupedExpr = `\\left( ${this.getFullLaTeXExpression()} \\right)`;
            const groupedVerbal = `${VERBAL_TOKENS.GRP_START}${this.getFullVerbalExpression()}${VERBAL_TOKENS.GRP_END}`;
            const groupedUnicode = `(${this.getFullUnicodeExpression()})`;
            const result = new CurrencyNBR(0n, totalValue, "", groupedExpr, "", groupedVerbal, "", groupedUnicode);
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "group"]).debug("Grouping performed {*}", {
                calcTime: end - start,
                mathState: {
                    latex: result.getFullLaTeXExpression(),
                    unicode: result.getFullUnicodeExpression(),
                },
                totalValue: totalValue.toString(),
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "group" });
            }
            throw e;
        }
    }

    /**
     * Finaliza o cálculo e retorna um objeto de saída para formatação.
     * @param decimals A precisão padrão desejada para o output (default: 6).
     * @param options Opções de formatação e arredondamento.
     */
    public commit(
        decimals: number = DEFAULT_DISPLAY_PRECISION,
        options?: CurrencyNBROutputOptions,
    ): CurrencyNBROutput {
        const start = performance.now();
        if (decimals < 0 || !Number.isInteger(decimals)) {
            throw new CurrencyNBRError({
                type: "invalid-precision",
                title: "Precisão Decimal Inválida",
                detail: `O número de casas decimais deve ser um inteiro positivo. Recebido: ${decimals}`,
                operation: "commit"
            });
        }
        try {
            const finalValue = this.accumulatedValue + this.activeTermValue;
            const result = new CurrencyNBROutput(
                finalValue,
                decimals,
                this.getFullLaTeXExpression(),
                this.getFullVerbalExpression(),
                this.getFullUnicodeExpression(),
                options,
            );
            const end = performance.now();
            getLogger(["currency-nbr-a11y", "engine", "commit"]).debug("Commit performed {*}", {
                calcTime: end - start,
                finalValue: finalValue.toString(),
                decimals,
            });
            return result;
        } catch (e) {
            if (!(e instanceof CurrencyNBRError)) {
                logFatal(e, { operation: "commit", decimals, options });
            }
            throw e;
        }
    }

    private getFullLaTeXExpression(): string {
        let expr = this.accumulatedExpression;
        if (this.accumulatedExpression && this.activeTermExpression) {
            expr += this.activeTermExpression.startsWith("-") ? " " : " + ";
        }
        expr += this.activeTermExpression;
        return expr;
    }

    private getFullVerbalExpression(): string {
        let verbal = this.accumulatedVerbal;
        if (this.accumulatedVerbal && this.activeTermVerbal) {
            // Verifica se o termo ativo já começa com token de subtração (negativo)
            // Se sim, usa espaço, senão usa ADD
            verbal += this.activeTermVerbal.startsWith(VERBAL_TOKENS.SUB) ? " " : VERBAL_TOKENS.ADD;
        }
        verbal += this.activeTermVerbal;
        return verbal;
    }

    private getFullUnicodeExpression(): string {
        let unicode = this.accumulatedUnicode;
        if (this.accumulatedUnicode && this.activeTermUnicode) {
            unicode += this.activeTermUnicode.startsWith("-") ? " " : " + ";
        }
        unicode += this.activeTermUnicode;
        return unicode;
    }
}
