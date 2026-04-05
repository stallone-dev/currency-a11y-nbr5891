// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * @module Wrappers
 * Utilitários para encapsulamento léxico de expressões matemáticas.
 *
 * Garante que operações complexas mantenham a precedência correta ao serem
 * integradas em fórmulas maiores, adicionando parênteses apenas quando
 * estritamente necessário para evitar redundância visual.
 */

/**
 * Envolve uma expressão LaTeX em parênteses elásticos (\left( ... \right))
 * se a expressão contiver operadores de baixa precedência (+ ou -) e não
 * estiver já agrupada.
 *
 * @param expr A expressão LaTeX.
 * @returns A expressão, possivelmente envolta em parênteses.
 */
export function wrapLaTeX(expr: string): string {
    const trimmed = expr.trim();
    // Detectamos se a expressão precisa de proteção para manter a integridade matemática
    if (
        !trimmed.startsWith("\\left(") && !trimmed.startsWith("{")
        && (trimmed.includes("+") || trimmed.includes(" - "))
    ) {
        return `\\left( ${expr} \\right)`;
    }
    return expr;
}

/**
 * Envolve uma expressão Unicode em parênteses normais (...) se necessário.
 *
 * @param expr A expressão Unicode.
 * @returns A expressão, possivelmente envolta em parênteses.
 */
export function wrapUnicode(expr: string): string {
    const trimmed = expr.trim();
    if (
        !trimmed.startsWith("(") && (trimmed.includes("+") || trimmed.includes(" - "))
    ) {
        return `(${expr})`;
    }
    return expr;
}
