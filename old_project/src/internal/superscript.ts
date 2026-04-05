// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * @module Superscript
 * Utilitário para conversão de caracteres numéricos em seus equivalentes
 * sobrescritos Unicode. Essencial para a representação legível de potências
 * em expressões Unicode auditáveis.
 */

/**
 * Converte caracteres normais para seus equivalentes sobrescritos em Unicode.
 *
 * @param s A string original.
 * @returns A string convertida para sobrescrito.
 */
export function toSuperscript(s: string): string {
    // Mapeamento direto para evitar recursão ou manipulação complexa de strings
    const map: Record<string, string> = {
        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹",
        "+": "⁺",
        "-": "⁻",
        "(": "⁽",
        ")": "⁾",
        ".": "·",
        ",": "·",
    };
    return s.split("").map((c) => map[c] || c).join("");
}
