/**
 * Configurações globais de precisão e escala para cálculos monetários.
 */

/**
 * Precisão decimal interna para todos os cálculos da biblioteca (12 casas).
 * Garante segurança contra erros de arredondamento em operações sucessivas.
 */
export const INTERNAL_CALCULATION_PRECISION = 12;

/**
 * Precisão decimal padrão para exibição final ao usuário (6 casas).
 */
export const DEFAULT_DISPLAY_PRECISION = 6;

/**
 * Fator de escala para representação BigInt interna (10^12).
 */
export const INTERNAL_SCALE_FACTOR = 10n ** BigInt(INTERNAL_CALCULATION_PRECISION);
