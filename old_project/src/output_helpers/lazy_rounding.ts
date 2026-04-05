// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { INTERNAL_CALCULATION_PRECISION } from "../constants.ts";
import { formatBigIntToString } from "./formatting.ts";
import type { RoundingMethod } from "./options.ts";
import { applyRounding } from "./rounding_manager.ts";

/**
 * Resultado da operação de arredondamento preguiçoso (lazy).
 * Consolida tanto o valor numérico quanto a sua representação textual.
 */
export interface LazyRoundingResult {
    /**
     * O valor BigInt arredondado na escala solicitada (ex: para 2 casas, "1.50" vira 150n).
     * Ideal para cálculos secundários e armazenamento.
     */
    centsValue: bigint;

    /**
     * A representação em string formatada do valor arredondado (ex: "1.50").
     * Pronto para exibição direta ao usuário.
     */
    stringValue: string;
}

/**
 * Helper para realizar o arredondamento e formatação de forma preguiçosa (lazy).
 *
 * Esta função é o coração da otimização de saída da biblioteca CalcAUD,
 * convertendo o valor interno de alta precisão (12 casas) para o formato
 * final desejado em uma única passagem.
 *
 * @param value O valor BigInt bruto na escala interna (12 casas).
 * @param decimals O número de casas decimais solicitado para o output.
 * @param roundingMethod O método de arredondamento a ser aplicado.
 * @returns Um objeto contendo o valor em "centavos" (escala reduzida) e a string formatada.
 */
export function outputLazyRounding(
    value: bigint,
    decimals: number,
    roundingMethod: RoundingMethod,
): LazyRoundingResult {
    // 1. Aplica o arredondamento da escala interna (12) para a escala alvo (ex: 2)
    const roundedValue = applyRounding(
        value,
        roundingMethod,
        INTERNAL_CALCULATION_PRECISION,
        decimals,
    );

    // 2. Converte o BigInt arredondado para String utilizando o helper de formatação manual.
    const stringValue = formatBigIntToString(roundedValue, decimals);

    return {
        centsValue: roundedValue,
        stringValue,
    };
}
