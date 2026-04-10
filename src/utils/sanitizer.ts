/**
 * CalcAUY - Utilitário de Sanitização para Proteção de PII
 * @module
 */

import type { CalculationNode } from "../ast/types.ts";

const REDACTED = "[PII]";

/** Chaves de objetos que são conhecidas por conter dados sensíveis (PII). */
const SENSITIVE_KEYS = new Set(["n", "d", "rawInput", "metadata", "label", "value", "originalInput"]);

/** Regex otimizado para identificar strings que representam números. */
const NUMERIC_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

/** Política global de logging. */
export const loggingPolicy = {
    /**
     * Se true (padrão), assume que os dados SÃO sensíveis e devem ser OCULTOS.
     * Se false, permite a exibição de dados sensíveis globalmente.
     */
    sensitive: true,
};

/**
 * Define a política global de logging para a proteção de PII.
 * @param policy Configuração da política (sensitive: true oculta, false mostra).
 */
export function setGlobalLoggingPolicy(policy: { sensitive: boolean }): void {
    loggingPolicy.sensitive = policy.sensitive;
}

/**
 * Determina se um nó deve ter seus dados ocultados com base na política
 * global e na sobreposição específica do nó via metadados.
 *
 * @param node Nó a ser verificado.
 * @returns true se deve ocultar, false se deve mostrar.
 */
function shouldHide(node: CalculationNode): boolean {
    const nodeOverride = node.metadata?.pii;

    // Se o nó tem uma sobreposição específica (pii: true|false)
    if (typeof nodeOverride === "boolean") {
        // pii: true -> identifica que É PII, portanto OCULTA (true)
        // pii: false -> identifica que NÃO é PII, portanto MOSTRA (false)
        return nodeOverride;
    }

    // Caso contrário, segue a política global (sensitive: true oculta, false mostra)
    return loggingPolicy.sensitive;
}

/**
 * Sanitiza a estrutura da AST para logs, removendo valores literais e metadados.
 * Mantém apenas a hierarquia e os tipos de operações, a menos que a política
 * ou o nó permitam a liberação.
 *
 * @param node Nó da AST a ser sanitizado.
 * @returns Objeto sanitizado pronto para log.
 */
export function sanitizeAST(node: CalculationNode): object {
    if (!node) { return { kind: "null" }; }

    const hide = shouldHide(node);

    const sanitized: Record<string, unknown> = {
        kind: node.kind,
    };

    if (node.kind === "literal") {
        sanitized.value = hide ? { n: REDACTED, d: REDACTED } : node.value;
        sanitized.originalInput = hide ? REDACTED : node.originalInput;
    } else if (node.kind === "group") {
        sanitized.child = sanitizeAST(node.child);
    } else if (node.kind === "operation") {
        sanitized.type = node.type;
        sanitized.operands = node.operands.map(sanitizeAST);
    }

    if (node.metadata) {
        if (hide) {
            sanitized.metadata = REDACTED;
        } else {
            sanitized.metadata = node.metadata;
        }
    }

    if (node.label) {
        sanitized.label = hide ? REDACTED : node.label;
    }

    return sanitized;
}

/**
 * Sanitiza um objeto genérico (como o ErrorContext), removendo valores que
 * possam conter PII se a política global estiver restritiva.
 *
 * @param obj Objeto ou valor a ser sanitizado.
 * @param seen Set para rastrear referências circulares (interno).
 * @returns Valor sanitizado.
 */
export function sanitizeObject(obj: unknown, seen = new WeakSet<object>()): unknown {
    if (obj === null || obj === undefined) { return obj; }

    // Se a política global NÃO for sensível (false), libera tudo
    if (!loggingPolicy.sensitive) { return obj; }

    if (typeof obj === "object") {
        // Proteção contra referências circulares (evita trava de CPU)
        if (seen.has(obj as object)) { return "[CIRCULAR]"; }
        seen.add(obj as object);

        if (Array.isArray(obj)) {
            return obj.map((item) => sanitizeObject(item, seen));
        }

        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            // Se for um nó da AST (identificado pelo campo 'kind')
            if (value && typeof value === "object" && "kind" in value) {
                result[key] = sanitizeAST(value as CalculationNode);
                continue;
            }

            // Campos conhecidos por conter dados sensíveis (O(1) via Set)
            if (SENSITIVE_KEYS.has(key)) {
                result[key] = REDACTED;
            } else {
                result[key] = sanitizeObject(value, seen);
            }
        }
        return result;
    }

    // Se for um valor primitivo que parece ser numérico ou sensível
    if (typeof obj === "number" || typeof obj === "bigint" || typeof obj === "string") {
        if (typeof obj === "string") {
            if (obj.length > 50) { return REDACTED; }
            // Otimização: Regex é mais rápido que Number() para triagem rápida
            if (obj.length > 0 && NUMERIC_RE.test(obj)) { return REDACTED; }
        } else {
            // Numbers e BigInts sempre são redigidos em modo sensível
            return REDACTED;
        }
    }

    return obj;
}
