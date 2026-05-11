/**
 * # CalcAUY - Auditable and Accessible Calculation Infrastructure
 *
 * CalcAUY is a high-precision library designed for systems that require
 * **absolute mathematical integrity** and **audit trail**.
 *
 * @module
 */

import type * as InternalTypes from "./internal-types.ts";

export { CalcAUY } from "./src/main.ts";
export { CalcAUYError } from "./src/core/errors.ts";
export type { CalcAUYLogic } from "./src/builder.ts";
export type { CalcAUYOutput } from "./src/output.ts";

export type {
    CalcAUYCustomOutput,
    CalcAUYCustomOutputContext,
    CalcAUYLocaleA11y,
    OutputOptions,
} from "./src/output_internal/types.ts";

export type { InternalTypes };
