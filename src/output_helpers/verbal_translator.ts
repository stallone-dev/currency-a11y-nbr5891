// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { LocaleLang } from "./options.ts";
import { VERBAL_TOKENS, VERBAL_TRANSLATIONS } from "./i18n.ts";

/**
 * @module VerbalTranslator
 * Motor de tradução e localização para descrições matemáticas acessíveis.
 *
 * Este componente transforma a expressão tokenizada (agnóstica a idioma) em
 * uma frase gramaticalmente correta no locale alvo, incluindo suporte a
 * diferentes separadores decimais (vírgula vs ponto).
 */

/**
 * Traduz a expressão verbal tokenizada para o locale especificado.
 *
 * Realiza a substituição de tokens de operação por termos naturais e
 * formata os números internos para respeitar as convenções regionais.
 *
 * @param template A string contendo tokens (ex: "10{#ADD#}20").
 * @param resultValue O valor final calculado formatado como string decimal.
 * @param locale O idioma alvo (ex: "pt-BR", "en-US").
 * @param roundingMethod O nome do método de arredondamento utilizado.
 * @returns A descrição verbal completa e localizada.
 */
export function translateVerbal(
    template: string,
    resultValue: string,
    locale: LocaleLang,
    roundingMethod: string,
): string {
    const dict = VERBAL_TRANSLATIONS[locale];
    let output = template;

    // 1. Substituir Tokens de Operação
    // Iteramos sobre todos os tokens conhecidos para garantir a tradução completa da frase.
    const tokens = Object.entries(VERBAL_TOKENS) as [keyof typeof VERBAL_TOKENS, string][];

    for (const [key, token] of tokens) {
        if (key === "COMMA" || key === "ROUNDING") { continue; }
        output = output.replaceAll(token, dict[key]);
    }

    // 2. Formatar Números na Expressão
    // Números em ponto flutuante (ex: 10.50) são convertidos para a grafia local (ex: 10,50).
    output = output.replaceAll(/(\d)\.(\d)/g, `$1${dict.COMMA}$2`);

    // 3. Adicionar o Resultado Final e Metadados de Arredondamento
    const finalResultVerbal = resultValue.replace(".", dict.COMMA);
    const roundingInfo = `${dict.ROUNDING}${roundingMethod})`;

    return `${output}${dict.EQ}${finalResultVerbal}${roundingInfo}`;
}
