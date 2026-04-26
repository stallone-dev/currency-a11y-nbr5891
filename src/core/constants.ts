/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export const LIB_NAME = "calc-auy";
export const LOG_NAMESPACE = [LIB_NAME] as const;

export const PRECISION_BIGINT = 50n;
export const SCALE_BIGINT = 10n ** PRECISION_BIGINT;

export const DEFAULT_LOCALE = "pt-BR";
export const DEFAULT_CURRENCY = "BRL";
export const DEFAULT_DECIMAL_PRECISION = 2;

export const ROUNDING_IDS = {
    NBR5891: "NBR-5891",
    HALF_UP: "HALF-UP",
    HALF_EVEN: "HALF-EVEN",
    TRUNCATE: "TRUNCATE",
    CEIL: "CEIL",
    NONE: "NONE",
} as const;

export type RoundingStrategy = keyof typeof ROUNDING_IDS;
