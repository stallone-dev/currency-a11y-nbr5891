// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { RoundingMethod } from "./options.ts";
import {
    roundCeil,
    roundHalfEven,
    roundHalfUp,
    roundToPrecisionNBR5891,
    roundTruncate,
} from "./rounding_strategies.ts";

/**
 * @module RoundingManager
 * Orquestrador central para operações de arredondamento.
 *
 * Esta camada atua como uma fachada (Facade) para as diferentes estratégias
 * de arredondamento implementadas na biblioteca, garantindo que o valor
 * correto seja despachado para o algoritmo correspondente.
 */

/**
 * Aplica o método de arredondamento selecionado, convertendo o valor da escala
 * interna de alta precisão para a escala de exibição desejada.
 *
 * @param value Valor BigInt na escala interna (geralmente 10^12).
 * @param method Estratégia de arredondamento (NBR-5891, HALF-EVEN, etc).
 * @param currentScale Escala decimal atual do BigInt (ex: 12).
 * @param targetDecimals Casas decimais desejadas no output (ex: 2).
 * @returns O valor BigInt ajustado e arredondado para a nova escala (targetDecimals).
 */
export function applyRounding(
    value: bigint,
    method: RoundingMethod,
    currentScale: number,
    targetDecimals: number,
): bigint {
    // Despachamos a operação para a implementação técnica específica.
    // Cada estratégia lida com casos de borda (como 0.5 exato) de forma distinta.
    switch (method) {
        case "HALF-EVEN":
            return roundHalfEven(value, currentScale, targetDecimals);
        case "HALF-UP":
            return roundHalfUp(value, currentScale, targetDecimals);
        case "TRUNCATE":
            return roundTruncate(value, currentScale, targetDecimals);
        case "CEIL":
            return roundCeil(value, currentScale, targetDecimals);
        case "NBR-5891":
        default:
            return roundToPrecisionNBR5891(value, currentScale, targetDecimals);
    }
}
