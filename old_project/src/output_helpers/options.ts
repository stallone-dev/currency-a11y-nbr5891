// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { LOCALE_CURRENCY_MAP } from "./locales.ts";

/**
 * Métodos de arredondamento disponíveis na biblioteca.
 * Baseados em normas técnicas (NBR-5891) e padrões internacionais.
 */
export const VALID_ROUNDING_METHODS = ["NBR-5891", "HALF-EVEN", "HALF-UP", "TRUNCATE", "CEIL"] as const;

/**
 * Define a estratégia de tratamento para o resto em divisões inteiras e módulos.
 * - 'truncated': Segue o padrão de linguagens como C/JS (resto com sinal do dividendo).
 * - 'euclidean': Garante que o resto seja sempre positivo.
 */
export type MathDivModStrategy = "truncated" | "euclidean";

/**
 * Tipo representando as strings literais dos métodos de arredondamento válidos.
 */
export type RoundingMethod = typeof VALID_ROUNDING_METHODS[number];

/**
 * Locales suportados para tradução verbal e formatação numérica.
 */
export type LocaleLang = keyof typeof LOCALE_CURRENCY_MAP;

/**
 * Interface para configurar o comportamento de saída (output) da biblioteca CalcAUD.
 *
 * Permite customizar desde o idioma das descrições até o algoritmo de
 * arredondamento fiscal.
 *
 * @example
 * ```ts
 * // Configuração Fiscal Brasileira (Padrão)
 * const options: CalcAUDOutputOptions = {
 *   locale: "pt-BR",
 *   roundingMethod: "NBR-5891"
 * };
 * ```
 *
 * @example
 * ```ts
 * // Configuração para Mercado Americano com Arredondamento Bancário
 * const options: CalcAUDOutputOptions = {
 *   locale: "en-US",
 *   roundingMethod: "HALF-EVEN",
 *   currency: "USD"
 * };
 * ```
 *
 * @example
 * ```ts
 * // Configuração Internacional: Texto em Português, Moeda em Ienes
 * const options: CalcAUDOutputOptions = {
 *   locale: "pt-BR",
 *   currency: "JPY"
 * };
 * ```
 */
export interface CalcAUDOutputOptions {
    /**
     * Define o algoritmo de arredondamento final.
     * @default "NBR-5891"
     */
    roundingMethod?: RoundingMethod;

    /**
     * Define o local para formatação numérica e tradução verbal.
     * @default "pt-BR"
     */
    locale?: LocaleLang;

    /**
     * Define a moeda para formatação (ex: "BRL", "USD", "CNY").
     * Se não definido, utiliza a moeda nativa associada ao 'locale'.
     */
    currency?: string;
}

/**
 * Valores padrão utilizados pela biblioteca quando o usuário não fornece opções.
 */
export const DEFAULT_OPTIONS: Required<CalcAUDOutputOptions> = {
    roundingMethod: "NBR-5891",
    locale: "pt-BR",
    currency: "BRL",
};
