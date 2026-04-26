/**
 * # CalcAUY - Engine de Cálculo Auditável e Acessível
 *
 * A CalcAUY é uma biblioteca de alta precisão projetada para sistemas que exigem
 * **integridade matemática absoluta** e **rastro de auditoria**.
 *
 * @module
 */

import { CalcAUY as CalcAUYClass } from "./src/main.ts";
import * as ASTTypes from "./src/ast/types.ts";

export { CalcAUYLogic } from "./src/builder.ts";
export { ProcessBatchAUY } from "./src/utils/batch.ts";
export { CalcAUYOutput } from "./src/output.ts";
export { CalcAUYError } from "./src/core/errors.ts";
export type { ICalcAUYCustomOutput, ICalcAUYCustomOutputContext } from "./src/output.ts";
export type { CalcAUYLocaleA11y } from "./src/i18n/i18n.ts";
export type { BatchOptions } from "./src/utils/batch.ts";
export type { RationalNumber } from "./src/core/rational.ts";
export type { RoundingStrategy } from "./src/core/constants.ts";
export type { OperationType } from "./src/ast/types.ts";

/**
 * Namespace para tipos internos da AST (Forense).
 * Uso: `type CalcAUY.InternalType.CalculationNode`
 */
export import InternalType = ASTTypes;

/**
 * Ponto de entrada principal para a CalcAUY.
 *
 * Contém a factory `create` para instâncias de cálculo e o namespace `InternalType`
 * para acesso a estruturas da AST.
 */
export const CalcAUY = Object.assign(CalcAUYClass, {
    InternalType,
});
