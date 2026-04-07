import { DEFAULT_LOCALE } from "../core/constants.ts";
import type { CalcAUYLocale } from "../core/types.ts";

/**
 * Definition of a localized strings and rules for calculation verbalization.
 */
export interface LocaleDefinition {
    locale: string;
    currency: string;
    decimalSeparator: string;
    voicedSeparator: string;
    thousandSeparator: string;
    operators: Record<string, string>;
    phrases: {
        isEqual: string;
        rounding: string;
        for: string;
        decimalPlaces: string;
        root_square: string;
        root_cubic: string;
        root_n: string;
    };
}

/**
 * Map of supported locales.
 */
export const LOCALES: Record<CalcAUYLocale, LocaleDefinition> = {
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
export function getLocale(code: CalcAUYLocale = DEFAULT_LOCALE as CalcAUYLocale): LocaleDefinition {
    return LOCALES[code] || LOCALES[DEFAULT_LOCALE as CalcAUYLocale];
}
