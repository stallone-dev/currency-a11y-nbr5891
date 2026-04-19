/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { CalculationNode } from "../ast/types.ts";

const REDACTED = "[PII]";

/** Chaves de objetos que são conhecidas por conter dados sensíveis (PII). */
const SENSITIVE_KEYS = new Set(["n", "d", "rawInput", "metadata", "label", "value", "originalInput"]);

/** Regex otimizado e seguro para identificar strings que representam números ou percentuais (evita backtracking). */
const NUMERIC_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?%?$/;

/** Tipos de codificação suportados para a assinatura digital. */
export type SignatureEncoder = "HEX" | "BASE64" | "BASE58" | "BASE32";

/** Política global de segurança e logging. */
export const securityPolicy = {
    /**
     * Se true (padrão), assume que os dados SÃO sensíveis e devem ser OCULTOS.
     * Se false, permite a exibição de dados sensíveis globalmente.
     */
    sensitive: true,
    /**
     * Sal secreto global usado para assinar árvores e resultados (BLAKE3).
     * Engenharia: Garante a integridade militar do rastro de auditoria.
     */
    salt: "",
    /**
     * Codificação da assinatura final.
     * Padrão: BASE58 (Melhor equilíbrio entre tamanho e legibilidade humana).
     */
    encoder: "BASE58" as SignatureEncoder,
};

/**
 * Define a política global de segurança para a proteção de PII e integridade.
 * @param policy Configuração da política (sensitive, salt, encoder).
 */
export function setGlobalSecurityPolicy(policy: {
    sensitive?: boolean;
    salt?: string;
    encoder?: SignatureEncoder;
}): void {
    if (typeof policy.sensitive === "boolean") {
        securityPolicy.sensitive = policy.sensitive;
    }
    if (typeof policy.salt === "string") {
        securityPolicy.salt = policy.salt;
    }
    if (policy.encoder) {
        securityPolicy.encoder = policy.encoder;
    }
}

/**
 * Determina se um nó deve ter seus dados ocultados com base na política
 * global ou na sobreposição específica do nó via metadados.
 *
 * @param node Nó a ser verificado.
 * @returns true se deve ocultar, false se deve mostrar.
 */
function shouldHide(node: CalculationNode): boolean {
    const nodeOverride = node.metadata?.pii;

    // Se o nó tem uma sobreposição específica (pii: true|false), ela manda.
    if (typeof nodeOverride === "boolean") {
        return nodeOverride;
    }

    // Caso contrário, segue estritamente a política global
    return securityPolicy.sensitive;
}

/**
 * Sanitiza a estrutura da AST para logs, removendo valores literais e metadados.
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
        sanitized.operands = node.operands.map((op) => sanitizeAST(op));
    }

    if (node.metadata) {
        sanitized.metadata = hide ? REDACTED : node.metadata;
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
    if (!securityPolicy.sensitive) { return obj; }

    if (typeof obj === "object") {
        // Proteção contra referências circulares (evita trava de CPU)
        if (seen.has(obj)) { return "[CIRCULAR]"; }
        seen.add(obj);

        if (Array.isArray(obj)) {
            return obj.map((item) => sanitizeObject(item, seen));
        }

        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value && typeof value === "object" && "kind" in value) {
                result[key] = sanitizeAST(value as CalculationNode);
                continue;
            }

            if (SENSITIVE_KEYS.has(key)) {
                result[key] = REDACTED;
            } else {
                result[key] = sanitizeObject(value, seen);
            }
        }
        return result;
    }

    if (typeof obj === "number" || typeof obj === "bigint" || typeof obj === "string") {
        if (typeof obj === "string") {
            if (obj.length > 50) { return REDACTED; }
            if (obj.length > 0 && NUMERIC_RE.test(obj)) { return REDACTED; }
        } else {
            return REDACTED;
        }
    }

    return obj;
}
