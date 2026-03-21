import { roundToPrecisionNBR5891 } from "./rounding.ts";
import { DEFAULT_DISPLAY_PRECISION, INTERNAL_CALCULATION_PRECISION, INTERNAL_SCALE_FACTOR } from "./constants.ts";
import { calculateBigIntPower, calculateNthRoot } from "./math_utils.ts";

/**
 * Representa qualquer valor que possa ser convertido em um montante auditável.
 * Aceita strings para evitar perda de precisão de ponto flutuante, numbers para conveniência
 * e BigInt para valores já escalados.
 */
export type NumericValue = string | number | bigint | AuditableAmount;

/**
 * Classe principal para cálculos financeiros precisos, auditáveis e acessíveis.
 *
 * DESIGN PATTERNS:
 * - Imutabilidade: Todas as operações retornam novas instâncias.
 * - State Machine: Gerencia registradores internos para respeitar a precedência PEMDAS.
 * - Multi-Output: Gera resultados em String numérica, LaTeX (visual) e Verbal (acessível).
 *
 * CONFORMIDADE:
 * - ABNT NBR 5891:1977 (Arredondamento).
 * - WCAG AAA & eMAG (Acessibilidade via narração em linguagem natural).
 */
export class AuditableAmount {
    /** Valor consolidado de operações de baixa precedência (+, -) na escala 10^12. */
    private readonly accumulatedValue: bigint;
    /** Valor do termo atual para operações de alta precedência (*, /, ^) na escala 10^12. */
    private readonly activeTermValue: bigint;

    /** Expressão LaTeX representando o valor acumulado. */
    private readonly accumulatedExpression: string;
    /** Expressão LaTeX representando o termo ativo. */
    private readonly activeTermExpression: string;

    /** Narração verbal do valor acumulado para acessibilidade. */
    private readonly accumulatedVerbal: string;
    /** Narração verbal do termo ativo para acessibilidade. */
    private readonly activeTermVerbal: string;

    private constructor(
        accumulatedValue: bigint,
        activeTermValue: bigint,
        accumulatedExpression: string,
        activeTermExpression: string,
        accumulatedVerbal: string,
        activeTermVerbal: string,
    ) {
        this.accumulatedValue = accumulatedValue;
        this.activeTermValue = activeTermValue;
        this.accumulatedExpression = accumulatedExpression;
        this.activeTermExpression = activeTermExpression;
        this.accumulatedVerbal = accumulatedVerbal;
        this.activeTermVerbal = activeTermVerbal;
    }

    /**
     * Ponto de entrada para criação de montantes.
     * @param value Valor inicial. Recomenda-se o uso de strings para decimais.
     */
    static from(value: NumericValue): AuditableAmount {
        if (value instanceof AuditableAmount) return value;

        const rawValue = typeof value === "bigint"
            ? value * INTERNAL_SCALE_FACTOR
            : this.parseStringValue(value.toString());

        const initialExpression = value.toString();
        const initialVerbal = initialExpression.replace(".", ",");

        return new AuditableAmount(0n, rawValue, "", initialExpression, "", initialVerbal);
    }

    /**
     * Parser rigoroso que converte strings em BigInt escalado.
     * Realiza arredondamento simples no 13º dígito decimal para garantir a integridade da base.
     */
    private static parseStringValue(value: string): bigint {
        const numericPattern = /^(-?\d+)(?:\.(\d+))?$/;
        const match = value.match(numericPattern);
        if (!match) throw new Error(`Invalid numeric format: ${value}`);
        const [_, integerPart, decimalPart = ""] = match;
        const isNegative = integerPart.startsWith("-");
        const absoluteInteger = BigInt(integerPart.replace("-", "")) * INTERNAL_SCALE_FACTOR;
        let absoluteDecimal = 0n;
        if (decimalPart) {
            const normalizedDecimal = decimalPart.slice(0, INTERNAL_CALCULATION_PRECISION + 1).padEnd(
                INTERNAL_CALCULATION_PRECISION + 1,
                "0",
            );
            absoluteDecimal = BigInt(normalizedDecimal.slice(0, INTERNAL_CALCULATION_PRECISION));
            if (Number(normalizedDecimal[INTERNAL_CALCULATION_PRECISION]) >= 5) absoluteDecimal += 1n;
        }
        const totalAbsoluteValue = absoluteInteger + absoluteDecimal;
        return isNegative ? -totalAbsoluteValue : totalAbsoluteValue;
    }

    /**
     * Adição matemática. Consolida o termo ativo no acumulador.
     */
    add(value: NumericValue): AuditableAmount {
        const other = AuditableAmount.from(value);
        const newAccumulatedValue = this.accumulatedValue + this.activeTermValue;
        const newAccumulatedExpr = this.getFullLaTeXExpression();
        const newAccumulatedVerbal = this.getFullVerbalExpression();

        return new AuditableAmount(
            newAccumulatedValue,
            other.accumulatedValue + other.activeTermValue,
            newAccumulatedExpr,
            other.activeTermExpression,
            newAccumulatedVerbal,
            other.activeTermVerbal,
        );
    }

    /**
     * Subtração matemática.
     */
    sub(value: NumericValue): AuditableAmount {
        const other = AuditableAmount.from(value);
        const otherValue = other.accumulatedValue + other.activeTermValue;
        const newAccumulatedValue = this.accumulatedValue + this.activeTermValue;
        const newAccumulatedExpr = this.getFullLaTeXExpression();
        const newAccumulatedVerbal = this.getFullVerbalExpression();

        return new AuditableAmount(
            newAccumulatedValue,
            -otherValue,
            newAccumulatedExpr,
            `- ${other.activeTermExpression}`,
            newAccumulatedVerbal,
            `menos ${other.activeTermVerbal}`,
        );
    }

    /**
     * Multiplicação. Atua exclusivamente sobre o termo ativo, respeitando a precedência.
     */
    mult(value: NumericValue): AuditableAmount {
        const other = AuditableAmount.from(value);
        const otherValue = other.accumulatedValue + other.activeTermValue;
        const nextActiveValue = (this.activeTermValue * otherValue) / INTERNAL_SCALE_FACTOR;

        const nextActiveExpr = `${this.wrapLaTeX(this.activeTermExpression)} \\times ${
            other.wrapLaTeX(other.getFullLaTeXExpression())
        }`;
        const nextActiveVerbal = `${this.activeTermVerbal} multiplicado por ${other.getFullVerbalExpression()}`;

        return new AuditableAmount(
            this.accumulatedValue,
            nextActiveValue,
            this.accumulatedExpression,
            nextActiveExpr,
            this.accumulatedVerbal,
            nextActiveVerbal,
        );
    }

    /**
     * Divisão. Atua exclusivamente sobre o termo ativo.
     */
    div(value: NumericValue): AuditableAmount {
        const other = AuditableAmount.from(value);
        const otherValue = other.accumulatedValue + other.activeTermValue;
        if (otherValue === 0n) throw new Error("Division by zero");

        const nextActiveValue = (this.activeTermValue * INTERNAL_SCALE_FACTOR) / otherValue;
        const nextActiveExpr = `\\frac{${this.activeTermExpression}}{${other.getFullLaTeXExpression()}}`;
        const nextActiveVerbal = `${this.activeTermVerbal} dividido por ${other.getFullVerbalExpression()}`;

        return new AuditableAmount(
            this.accumulatedValue,
            nextActiveValue,
            this.accumulatedExpression,
            nextActiveExpr,
            this.accumulatedVerbal,
            nextActiveVerbal,
        );
    }

    /**
     * Exponenciação e Raízes.
     * Suporta frações (ex: "1/2") para cálculo de raízes com precisão preservada.
     */
    pow(exponent: string | number): AuditableAmount {
        const baseValue = this.activeTermValue;
        const baseExpr = this.wrapLaTeX(this.activeTermExpression);
        const baseVerbal = this.activeTermVerbal;
        let nextExpr: string;
        let nextVerbal: string;
        let nextValue: bigint;

        const expStr = exponent.toString();
        if (expStr.includes("/")) {
            const [num, den] = expStr.split("/").map((s) => BigInt(s.trim()));
            nextValue = calculateNthRoot(
                calculateBigIntPower(baseValue, num) *
                    calculateBigIntPower(INTERNAL_SCALE_FACTOR, den - num),
                den,
            );
            nextExpr = num === 1n ? `\\sqrt[${den}]{${baseExpr}}` : `\\sqrt[${den}]{${baseExpr}^{${num}}}`;
            nextVerbal = `raiz de índice ${den} de ${baseVerbal}${num === 1n ? "" : " elevado a " + num}`;
        } else {
            const exp = BigInt(expStr);
            nextExpr = `{${baseExpr}}^{${expStr}}`;
            nextVerbal = `${baseVerbal} elevado a ${expStr}`;
            if (exp === 0n) nextValue = INTERNAL_SCALE_FACTOR;
            else if (exp > 0n) {
                nextValue = calculateBigIntPower(baseValue, exp) /
                    calculateBigIntPower(INTERNAL_SCALE_FACTOR, exp - 1n);
            } else {
                const denVal = calculateBigIntPower(baseValue, -exp) /
                    calculateBigIntPower(INTERNAL_SCALE_FACTOR, (-exp) - 1n);
                nextValue = (INTERNAL_SCALE_FACTOR * INTERNAL_SCALE_FACTOR) / denVal;
            }
        }

        return new AuditableAmount(
            this.accumulatedValue,
            nextValue,
            this.accumulatedExpression,
            nextExpr,
            this.accumulatedVerbal,
            nextVerbal,
        );
    }

    /**
     * Consolida acumulador e termo ativo em um novo grupo protegido por parênteses.
     * Essencial para forçar ordens de cálculo (ex: (a + b) * c).
     */
    group(): AuditableAmount {
        const totalValue = this.accumulatedValue + this.activeTermValue;
        const groupedExpr = `\\left( ${this.getFullLaTeXExpression()} \\right)`;
        const groupedVerbal = `em grupo, ${this.getFullVerbalExpression()}, fim do grupo`;

        return new AuditableAmount(0n, totalValue, "", groupedExpr, "", groupedVerbal);
    }

    /**
     * Finaliza o cálculo e retorna o valor formatado com arredondamento NBR 5891.
     * @param decimals Casas decimais desejadas (padrão: 6).
     */
    commit(decimals: number = DEFAULT_DISPLAY_PRECISION): string {
        const finalValue = this.accumulatedValue + this.activeTermValue;
        const rounded = roundToPrecisionNBR5891(finalValue, INTERNAL_CALCULATION_PRECISION, decimals);
        return this.formatBigInt(rounded, decimals);
    }

    private formatBigInt(value: bigint, decimals: number): string {
        const isNeg = value < 0n;
        const abs = isNeg ? -value : value;
        const scale = 10n ** BigInt(decimals);
        const int = abs / scale;
        const frac = (abs % scale).toString().padStart(decimals, "0");
        return `${isNeg ? "-" : ""}${int}.${frac}`;
    }

    /** Gera a expressão LaTeX completa para auditoria visual. */
    toLaTeX(decimals: number = DEFAULT_DISPLAY_PRECISION): string {
        return `$$ ${this.getFullLaTeXExpression()} = ${this.commit(decimals)} $$`;
    }

    /**
     * Gera narração verbal completa para acessibilidade (WCAG AAA).
     * Transforma símbolos matemáticos em linguagem natural clara.
     */
    toVerbal(decimals: number = DEFAULT_DISPLAY_PRECISION): string {
        const result = this.commit(decimals).replace(".", " vírgula ");
        return `${this.getFullVerbalExpression()} é igual a ${result}`;
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
            verbal += this.activeTermVerbal.includes("menos") ? " " : " mais ";
        }
        verbal += this.activeTermVerbal;
        return verbal;
    }

    private wrapLaTeX(expr: string): string {
        const trimmed = expr.trim();
        if (
            !trimmed.startsWith("\\left(") && !trimmed.startsWith("{") &&
            (trimmed.includes("+") || trimmed.includes(" - "))
        ) {
            return `\\left( ${expr} \\right)`;
        }
        return expr;
    }

    toString(): string {
        return this.commit();
    }
}
