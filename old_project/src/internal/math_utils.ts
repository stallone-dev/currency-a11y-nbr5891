// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { CalcAUDError } from "../errors.ts";

/**
 * @module MathUtils
 * Utilitários matemáticos de alta precisão otimizados para o tipo BigInt.
 * Estas funções lidam com operações que não são nativamente suportadas por BigInt
 * ou que exigem comportamento específico para auditoria financeira.
 */

/**
 * Calcula a potência de um BigInt usando o algoritmo de exponenciação binária (Square-and-Multiply).
 *
 * Este algoritmo é O(log n), sendo extremamente eficiente para grandes expoentes.
 *
 * @param base A base do cálculo.
 * @param exponent O expoente (deve ser não-negativo).
 * @returns O resultado da base elevada ao expoente.
 * @throws CalcAUDError se o expoente for negativo.
 */
export function calculateBigIntPower(base: bigint, exponent: bigint): bigint {
    if (exponent < 0n) {
        throw new CalcAUDError({
            type: "negative-exponent",
            title: "Operação de Potência Inválida",
            detail: "Expoentes negativos não são suportados para operações de potência com BigInt nesta biblioteca.",
            operation: "power",
        });
    }
    if (exponent === 0n) { return 1n; }
    if (exponent === 1n) { return base; }

    let result = 1n;
    let currentBase = base;
    let currentExponent = exponent;

    // Implementação de Square-and-Multiply para performance ótima com BigInt
    while (currentExponent > 0n) {
        if (currentExponent % 2n === 1n) {
            result *= currentBase;
        }
        currentBase *= currentBase;
        currentExponent /= 2n;
    }
    return result;
}

/**
 * Calcula a raiz n-ésima de um BigInt utilizando métodos híbridos de Newton-Raphson e Busca Binária.
 *
 * Para índices baixos, utilizamos Newton-Raphson pela velocidade de convergência quadrática.
 * Para índices altos, utilizamos Busca Binária para garantir estabilidade numérica.
 *
 * @param value O valor do radicando.
 * @param rootIndex O índice da raiz (ex: 2 para quadrada, 3 para cúbica).
 * @returns A parte inteira da raiz calculada (piso).
 * @throws CalcAUDError para índices inválidos ou raízes pares de números negativos.
 */
export function calculateNthRoot(value: bigint, rootIndex: bigint): bigint {
    if (rootIndex <= 0n) {
        throw new CalcAUDError({
            type: "invalid-root-index",
            title: "Operação de Raiz Inválida",
            detail: "O índice da raiz deve ser um número inteiro positivo.",
            operation: "root",
        });
    }
    if (value < 0n && rootIndex % 2n === 0n) {
        throw new CalcAUDError({
            type: "even-root-of-negative",
            title: "Operação de Raiz Inválida",
            detail: "Não é possível calcular a raiz par de um número negativo (resultado complexo não suportado).",
            operation: "root",
        });
    }
    if (rootIndex === 1n) { return value; }

    const isValueNegative = value < 0n;
    const absoluteValue = isValueNegative ? -value : value;

    // Estimativa inicial otimizada baseada no comprimento de bits para acelerar a convergência
    const bitLength = getBitLengthFast(absoluteValue);
    let currentGuess = 1n << (bitLength / rootIndex + 1n);

    // Selecionamos o motor de cálculo baseado no índice para equilibrar velocidade e segurança
    if (rootIndex <= 10n) {
        // MOTOR NEWTON-RAPHSON: Convergência ultra-rápida para raízes comuns (quadrada, cúbica, etc)
        while (true) {
            const previousGuess = currentGuess;
            const guessPowMinusOne = previousGuess ** (rootIndex - 1n);

            // Passo de Newton: x_{n+1} = ((k-1)x_n + A / x_n^{k-1}) / k
            currentGuess = ((rootIndex - 1n) * previousGuess + absoluteValue / guessPowMinusOne) / rootIndex;

            if (currentGuess >= previousGuess - 1n && currentGuess <= previousGuess + 1n) { break; }
        }

        // Ajuste final para garantir o comportamento de "piso" (floor) exigido em cálculos financeiros
        if (currentGuess ** rootIndex > absoluteValue) {
            while (currentGuess ** rootIndex > absoluteValue) { currentGuess--; }
        } else {
            while ((currentGuess + 1n) ** rootIndex <= absoluteValue) { currentGuess++; }
        }
        return isValueNegative ? -currentGuess : currentGuess;
    } else {
        // MOTOR BUSCA BINÁRIA: Garante estabilidade onde Newton-Raphson pode oscilar com BigInt
        let low = 1n;
        let high = currentGuess;
        let bestGuess = 1n;

        while (low <= high) {
            const mid = (low + high) >> 1n;
            const midPow = calculateBigIntPower(mid, rootIndex);

            if (midPow === absoluteValue) { return isValueNegative ? -mid : mid; }

            if (midPow < absoluteValue) {
                bestGuess = mid;
                low = mid + 1n;
            } else {
                high = mid - 1n;
            }
        }
        return isValueNegative ? -bestGuess : bestGuess;
    }
}

/**
 * Calcula a potência fracionária de um BigInt com um fator de escala.
 *
 * Esta função resolve a equação (base/scale)^(num/den) mantendo o resultado na escala original.
 * Essencial para cálculos de juros compostos e taxas equivalentes.
 *
 * @param base O valor base (já escalonado).
 * @param num O numerador do expoente.
 * @param den O denominador do expoente.
 * @param scale O fator de escala interna.
 * @returns O resultado da operação, escalonado.
 * @throws CalcAUDError se o denominador for zero ou negativo.
 */
export function calculateFractionalPower(base: bigint, num: bigint, den: bigint, scale: bigint): bigint {
    if (den <= 0n) {
        throw new CalcAUDError({
            type: "invalid-root-index",
            title: "Operação de Raiz Inválida",
            detail: "O denominador de um expoente fracionário deve ser um número inteiro positivo.",
            operation: "power",
        });
    }

    const exponentDiff = den - num;

    let radicand: bigint;
    if (exponentDiff >= 0n) {
        // Caso den >= num: (base^num * scale^(den-num))^(1/den)
        radicand = calculateBigIntPower(base, num) * calculateBigIntPower(scale, exponentDiff);
    } else {
        // Caso num > den: (base^num / scale^(num-den))^(1/den)
        radicand = calculateBigIntPower(base, num) / calculateBigIntPower(scale, -exponentDiff);
    }

    return calculateNthRoot(radicand, den);
}

/**
 * Estima a quantidade de bits de um BigInt de forma performática.
 *
 * Evita o custo de serialização para string, operando diretamente nos bits do BigInt.
 */
function getBitLengthFast(value: bigint): bigint {
    if (value === 0n) { return 0n; }

    let bits = 1n;
    let temp = value;

    // Processamento em blocos de 64 bits para máxima performance em arquiteturas modernas
    while (temp >= 18446744073709551616n) { // 2^64
        temp >>= 64n;
        bits += 64n;
    }
    while (temp >= 2n) {
        temp >>= 1n;
        bits += 1n;
    }

    return bits;
}
