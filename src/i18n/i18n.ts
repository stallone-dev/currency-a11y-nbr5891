/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { DEFAULT_LOCALE } from "../core/constants.ts";
import type { CalcAUYLocale } from "../core/types.ts";

/**
 * Define a estrutura de tradução e regras de verbalização (A11y) para a CalcAUYLogic.
 *
 * **Engenharia:** Esta interface permite a internacionalização completa do rastro de auditoria
 * falado. Ao fornecer uma implementação customizada, é obrigatório preencher todos os tokens
 * para garantir que a reconstrução da frase seja fluida e sem termos indefinidos.
 *
 * @interface
 */
export interface CalcAUYLocaleA11y {
    /** Código do locale (ex: "pt-BR", "en-US"). */
    locale: string;
    /** Símbolo da moeda padrão para este locale (ISO 4217). */
    currency: string;
    /** Caractere separador de decimais (ex: "," ou "."). */
    decimalSeparator: string;
    /** Termo falado para o separador decimal (ex: " vírgula " ou " point "). */
    voicedSeparator: string;
    /** Caractere separador de milhar (ex: "." ou ","). */
    thousandSeparator: string;
    /** Dicionário de tradução para operadores matemáticos. */
    operators: {
        /** Termo para adição (+). */
        add: string;
        /** Termo para subtração (-). */
        sub: string;
        /** Termo para multiplicação (*). */
        mul: string;
        /** Termo para divisão (/). */
        div: string;
        /** Termo para exponenciação (^). */
        pow: string;
        /** Termo para módulo (%). */
        mod: string;
        /** Termo para divisão inteira (//). */
        divInt: string;
        /** Termo para abertura de agrupamento. */
        group_start: string;
        /** Termo para fechamento de agrupamento. */
        group_end: string;
    };
    /** Frases e conectivos utilizados na construção da narração. */
    phrases: {
        /** Conectivo de igualdade (ex: " é igual a "). */
        isEqual: string;
        /** Termo para indicar a estratégia de arredondamento. */
        rounding: string;
        /** Preposição de alvo (ex: "para"). */
        for: string;
        /** Termo para casas decimais. */
        decimalPlaces: string;
        /** Prefixo para raiz quadrada. */
        root_square: string;
        /** Prefixo para raiz cúbica. */
        root_cubic: string;
        /** Template para raiz enésima (deve conter o placeholder {den}). */
        root_n: string;
    };
}

/**
 * Map of supported locales.
 */
export const LOCALES: Record<CalcAUYLocale, CalcAUYLocaleA11y> = {
    "pt-BR": {
        locale: "pt-BR",
        currency: "BRL",
        decimalSeparator: ",",
        voicedSeparator: " vírgula ",
        thousandSeparator: ".",
        operators: {
            add: "mais",
            sub: "menos",
            mul: "multiplicado por",
            div: "dividido por",
            pow: "elevado a",
            mod: "módulo",
            divInt: "divisão inteira por",
            group_start: "abre parênteses",
            group_end: "fecha parênteses",
        },
        phrases: {
            isEqual: " é igual a ",
            rounding: "Arredondamento",
            for: "para",
            decimalPlaces: "casas decimais",
            root_square: "raiz quadrada de ",
            root_cubic: "raiz cúbica de ",
            root_n: "raiz {den}-ésima de ",
        },
    },
    "en-US": {
        locale: "en-US",
        currency: "USD",
        decimalSeparator: ".",
        voicedSeparator: " point ",
        thousandSeparator: ",",
        operators: {
            add: "plus",
            sub: "minus",
            mul: "multiplied by",
            div: "divided by",
            pow: "to the power of",
            mod: "modulo",
            divInt: "integer division by",
            group_start: "open parenthesis",
            group_end: "close parenthesis",
        },
        phrases: {
            isEqual: " is equal to ",
            rounding: "Rounding",
            for: "for",
            decimalPlaces: "decimal places",
            root_square: "square root of ",
            root_cubic: "cubic root of ",
            root_n: "the {den}-th root of ",
        },
    },
    "en-EU": {
        locale: "en-EU",
        currency: "EUR",
        decimalSeparator: ",",
        voicedSeparator: " comma ",
        thousandSeparator: ".",
        operators: {
            add: "plus",
            sub: "minus",
            mul: "multiplied by",
            div: "divided by",
            pow: "to the power of",
            mod: "modulo",
            divInt: "integer division by",
            group_start: "open parenthesis",
            group_end: "close parenthesis",
        },
        phrases: {
            isEqual: " is equal to ",
            rounding: "Rounding",
            for: "for",
            decimalPlaces: "decimal places",
            root_square: "square root of ",
            root_cubic: "cubic root of ",
            root_n: "the {den}-th root of ",
        },
    },
    "es-ES": {
        locale: "es-ES",
        currency: "EUR",
        decimalSeparator: ",",
        voicedSeparator: " coma ",
        thousandSeparator: ".",
        operators: {
            add: "más",
            sub: "menos",
            mul: "multiplicado por",
            div: "dividido por",
            pow: "elevado a",
            mod: "módulo",
            divInt: "división entera por",
            group_start: "abrir paréntesis",
            group_end: "cerrar paréntesis",
        },
        phrases: {
            isEqual: " es igual a ",
            rounding: "Redondeo",
            for: "para",
            decimalPlaces: "decimales",
            root_square: "raíz cuadrada de ",
            root_cubic: "raíz cúbica de ",
            root_n: "raíz {den}-ésima de ",
        },
    },
    "fr-FR": {
        locale: "fr-FR",
        currency: "EUR",
        decimalSeparator: ",",
        voicedSeparator: " virgule ",
        thousandSeparator: " ",
        operators: {
            add: "plus",
            sub: "moins",
            mul: "multiplié par",
            div: "divisé por",
            pow: "puissance",
            mod: "modulo",
            divInt: "division entière par",
            group_start: "ouvrir la parenthèse",
            group_end: "fermer la parenthèse",
        },
        phrases: {
            isEqual: " est égal à ",
            rounding: "Arrondi",
            for: "pour",
            decimalPlaces: "décimales",
            root_square: "racine carrée de ",
            root_cubic: "racine cubique de ",
            root_n: "racine {den}-ème de ",
        },
    },
    "de-DE": {
        locale: "de-DE",
        currency: "EUR",
        decimalSeparator: ",",
        voicedSeparator: " Komma ",
        thousandSeparator: ".",
        operators: {
            add: "plus",
            sub: "minus",
            mul: "multipliziert mit",
            div: "dividiert durch",
            pow: "hoch",
            mod: "modulo",
            divInt: "ganzzahlige division durch",
            group_start: "klammer auf",
            group_end: "klammer zu",
        },
        phrases: {
            isEqual: " ist gleich ",
            rounding: "Rundung",
            for: "auf",
            decimalPlaces: "Dezimalstellen",
            root_square: "Quadratwurzel aus ",
            root_cubic: "Kubikwurzel aus ",
            root_n: "{den}-te Wurzel aus ",
        },
    },
    "ru-RU": {
        locale: "ru-RU",
        currency: "RUB",
        decimalSeparator: ",",
        thousandSeparator: " ",
        voicedSeparator: " запятая ",
        operators: {
            add: "плюс",
            sub: "минус",
            mul: "умножить na",
            div: "разделить na",
            pow: "в степени",
            mod: "остаток от деления",
            divInt: "целочисленное деление na",
            group_start: "открыть скобку",
            group_end: "закрыть скобку",
        },
        phrases: {
            isEqual: " равно ",
            rounding: "Округление",
            for: "до",
            decimalPlaces: "знаков após запятой",
            root_square: "квадратный корень из ",
            root_cubic: "кубический корень из ",
            root_n: "корень {den}-й степени из ",
        },
    },
    "zh-CN": {
        locale: "zh-CN",
        currency: "CNY",
        decimalSeparator: ".",
        thousandSeparator: ",",
        voicedSeparator: " 点 ",
        operators: {
            add: "加",
            sub: "减",
            mul: "乘",
            div: "除",
            pow: "次方",
            mod: "取模",
            divInt: "整除",
            group_start: "左括号",
            group_end: "右括号",
        },
        phrases: {
            isEqual: " 等于 ",
            rounding: "舍入",
            for: "保留",
            decimalPlaces: "位小数",
            root_square: "平方根 ",
            root_cubic: "立方根 ",
            root_n: "{den}次方根 ",
        },
    },
    "ja-JP": {
        locale: "ja-JP",
        currency: "JPY",
        decimalSeparator: ".",
        thousandSeparator: ",",
        voicedSeparator: " 点 ",
        operators: {
            add: "たす",
            sub: "ひく",
            mul: "かける",
            div: "わる",
            pow: "の",
            mod: "あまり",
            divInt: "整数除算",
            group_start: "かっこ",
            group_end: "かっことじる",
        },
        phrases: {
            isEqual: " は ",
            rounding: "丸め",
            for: "で",
            decimalPlaces: "桁",
            root_square: "平方根 ",
            root_cubic: "立方根 ",
            root_n: "{den}乗根 ",
        },
    },
};

/**
 * Retrieves the locale definition for a given code.
 */
export function getLocale(code: CalcAUYLocale = DEFAULT_LOCALE as CalcAUYLocale): CalcAUYLocaleA11y {
    return LOCALES[code] || LOCALES[DEFAULT_LOCALE as CalcAUYLocale];
}
