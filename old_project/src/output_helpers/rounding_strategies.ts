// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * @module RoundingStrategies
 * Implementa algoritmos de arredondamento determinísticos para BigInt com escala fixa.
 *
 * Todas as funções operam transformando a diferença entre as escalas em um divisor
 * de base 10, permitindo que o arredondamento seja calculado via aritmética inteira pura.
 */

/**
 * Implementação rigorosa do arredondamento decimal conforme a norma ABNT NBR 5891:1977.
 *
 * Regras principais:
 * 1. Menor que 5: mantém o dígito.
 * 2. Maior que 5: incrementa o dígito.
 * 3. Exatamente 5: arredonda para o algarismo PAR mais próximo (critério de desempate).
 *
 * @param value O valor bruto em BigInt a ser arredondado.
 * @param currentPrecision A precisão decimal atual do valor (ex: 12).
 * @param targetPrecision A precisão decimal desejada (ex: 2).
 * @returns O valor arredondado em BigInt na escala desejada.
 */
export function roundToPrecisionNBR5891(
    value: bigint,
    currentPrecision: number,
    targetPrecision: number,
): bigint {
    // Se a precisão desejada for maior ou igual à atual, apenas escalamos para cima (padding).
    if (currentPrecision <= targetPrecision) {
        const scaleFactor = 10n ** BigInt(targetPrecision - currentPrecision);
        return value * scaleFactor;
    }

    const precisionDifference = currentPrecision - targetPrecision;
    const divisor = 10n ** BigInt(precisionDifference);
    const midPointThreshold = divisor / 2n;

    const integralPart = value / divisor;
    const fractionalRemainder = value % divisor;
    const absoluteRemainder = fractionalRemainder < 0n ? -fractionalRemainder : fractionalRemainder;

    // Regra 1 e 2: Comportamento padrão para valores distantes do ponto médio (0.5).
    if (absoluteRemainder < midPointThreshold) {
        return integralPart;
    } else if (absoluteRemainder > midPointThreshold) {
        const adjustment = value >= 0n ? 1n : -1n;
        return integralPart + adjustment;
    } else {
        // Regra 3: Caso crítico de 0.5 exato.
        // Aplicamos o "arredondamento ao par" para evitar viés estatístico em grandes conjuntos de dados.
        const lastDigitOfIntegral = integralPart < 0n ? -(integralPart % 10n) : (integralPart % 10n);
        const isLastDigitEven = lastDigitOfIntegral % 2n === 0n;

        if (isLastDigitEven) {
            return integralPart;
        } else {
            const adjustment = value >= 0n ? 1n : -1n;
            return integralPart + adjustment;
        }
    }
}

/**
 * Arredondamento "Half-Up" (Padrão Escolar/Comercial).
 *
 * Se a parte fracionária for maior ou igual a 0.5 em magnitude, arredonda
 * para longe do zero.
 */
export function roundHalfUp(value: bigint, currentScale: number, targetDecimals: number): bigint {
    const scaleDiff = BigInt(currentScale - targetDecimals);
    if (scaleDiff <= 0n) { return value; }

    const divisor = 10n ** scaleDiff;
    const remainder = value % divisor;
    const half = divisor / 2n;

    let result = value / divisor;

    // Tratamento simétrico para números negativos e positivos
    if (value < 0n) {
        if (remainder <= -half) {
            result -= 1n;
        }
    } else {
        if (remainder >= half) {
            result += 1n;
        }
    }

    return result;
}

/**
 * Arredondamento "Half-Even" (Bancário/Estatístico).
 *
 * Minimiza o erro acumulado em somas sucessivas ao arredondar o 0.5
 * sempre para o número par mais próximo.
 */
export function roundHalfEven(value: bigint, currentScale: number, targetDecimals: number): bigint {
    const scaleDiff = BigInt(currentScale - targetDecimals);
    if (scaleDiff <= 0n) { return value; }

    const divisor = 10n ** scaleDiff;
    const remainder = value % divisor;
    const half = divisor / 2n;

    let result = value / divisor;

    // Verificamos se o resto é exatamente a metade do divisor
    if (remainder === half || remainder === -half) {
        // Critério do par: se o resultado atual for ímpar, forçamos o arredondamento.
        if (result % 2n !== 0n) {
            if (value < 0n) {
                result -= 1n;
            } else {
                result += 1n;
            }
        }
    } else {
        // Caso não seja exatamente 0.5, segue o comportamento padrão do Half-Up
        if (value < 0n) {
            if (remainder < -half) { result -= 1n; }
        } else {
            if (remainder > half) { result += 1n; }
        }
    }

    return result;
}

/**
 * Arredondamento "Truncate" (Corte Seco).
 *
 * Simplesmente descarta todos os dígitos além da precisão desejada.
 * Equivalente ao 'floor' para positivos e 'ceil' para negativos em direção ao zero.
 */
export function roundTruncate(value: bigint, currentScale: number, targetDecimals: number): bigint {
    const scaleDiff = BigInt(currentScale - targetDecimals);
    if (scaleDiff <= 0n) { return value; }

    const divisor = 10n ** scaleDiff;
    return value / divisor;
}

/**
 * Arredondamento "Ceil" (Teto).
 *
 * Sempre arredonda em direção ao infinito positivo, independente do sinal.
 */
export function roundCeil(value: bigint, currentScale: number, targetDecimals: number): bigint {
    const scaleDiff = BigInt(currentScale - targetDecimals);
    if (scaleDiff <= 0n) { return value; }

    const divisor = 10n ** scaleDiff;
    const remainder = value % divisor;

    let result = value / divisor;

    // Se houver qualquer resíduo positivo, incrementamos o resultado.
    if (remainder > 0n) {
        result += 1n;
    }

    return result;
}
