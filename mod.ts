/**
 * Ponto de entrada oficial da biblioteca currency-math-audit.
 * Exporta a classe principal e tipos para cálculos financeiros precisos e auditáveis.
 */

export { AuditableAmount } from "./src/amount.ts";
export type { NumericValue } from "./src/amount.ts";

/**
 * Re-exporta configurações de precisão para uso externo, se necessário.
 */
export { DEFAULT_DISPLAY_PRECISION, INTERNAL_CALCULATION_PRECISION } from "./src/constants.ts";
