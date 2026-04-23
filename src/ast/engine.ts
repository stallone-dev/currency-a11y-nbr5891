/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { CalculationNode, OperationType } from "./types.ts";
import { RationalNumber } from "../core/rational.ts";
import { CalcAUYError } from "../core/errors.ts";
import { getSubLogger, measureTime } from "../utils/logger.ts";
import { sanitizeAST } from "../utils/sanitizer.ts";

const logger = getSubLogger("engine");

/**
 * Limite de profundidade da árvore para evitar estouro da pilha de chamadas (Stack Overflow).
 * Em sistemas auditáveis, expressões extremamente profundas devem ser divididas em sub-cálculos.
 */
const MAX_RECURSION_DEPTH = 500;

/**
 * Colapsa recursivamente um nó da AST em um resultado final (RationalNumber).
 *
 * **Fase de Commit:**
 * Esta função representa o momento da execução real do cálculo. Ela percorre a
 * árvore em profundidade (Post-order Traversal), resolvendo primeiro os operandos
 * e depois aplicando a operação correspondente.
 *
 * @param node Nó raiz da expressão.
 * @param depth Nível atual de recursão (usado para controle de segurança).
 * @returns {RationalNumber} O resultado matemático puro e exato.
 */
export function evaluate(node: CalculationNode, depth = 0): RationalNumber {
    if (depth > MAX_RECURSION_DEPTH) {
        throw new CalcAUYError(
            "math-overflow",
            "A profundidade da expressão excedeu o limite de segurança (AST muito complexa).",
            { partialAST: node },
        );
    }

    // Modo Produção: Execução direta e rápida sem overhead de telemetria.
    if (!logger.isEnabledFor("debug")) {
        return evaluateNode(node, depth);
    }

    // Modo Debug: Mede performance e loga estrutura sanitizada para auditoria técnica.
    const [result, duration] = measureTime(() => evaluateNode(node, depth));

    logger.debug("Node evaluated", {
        operation_kind: node.kind,
        depth,
        duration,
        structure: sanitizeAST(node),
    });

    return result;
}

/**
 * Lógica interna de avaliação sem telemetria para permitir reuso e performance.
 */
function evaluateNode(node: CalculationNode, depth: number): RationalNumber {
    switch (node.kind) {
        case "literal":
            return RationalNumber.from(BigInt(node.value.n), BigInt(node.value.d));

        case "group":
            return evaluate(node.child, depth + 1);

        case "control":
            return evaluate(node.child, depth + 1);

        case "operation":
            return evaluateOperation(node.type, node.operands, depth + 1, node);

        default: {
            throw new CalcAUYError(
                "corrupted-node",
                "Tipo de nó desconhecido na AST.",
                { partialAST: node },
            );
        }
    }
}

/**
 * Resolve internamente uma operação específica entre múltiplos operandos.
 */
function evaluateOperation(
    type: OperationType,
    operands: CalculationNode[],
    depth: number,
    parentNode: CalculationNode,
): RationalNumber {
    const len = operands.length;
    if (len === 0) {
        throw new CalcAUYError("corrupted-node", `Operação '${type}' sem operandos.`, { partialAST: parentNode });
    }

    // Resolve o primeiro operando para iniciar o acúmulo.
    let acc: RationalNumber = evaluate(operands[0], depth);

    // Validação de segurança: garante que o tipo da operação é conhecido,
    // mesmo para nós com um único operando onde o loop não seria executado.
    const supportedOps: OperationType[] = ["add", "sub", "mul", "div", "pow", "mod", "divInt", "crossContextAdd"];
    if (!supportedOps.includes(type)) {
        throw new CalcAUYError("corrupted-node", `Operação não suportada: ${type}`, {
            partialAST: parentNode,
        });
    }

    try {
        // Resolve os demais operandos e aplica a operação sequencialmente.
        // Otimização: Uso de loop for simples evita alocações de arrays temporários (map/slice/reduce).
        for (let i = 1; i < len; i++) {
            const val: RationalNumber = evaluate(operands[i], depth);

            switch (type) {
                case "add":
                case "crossContextAdd":
                    acc = acc.add(val);
                    break;
                case "sub":
                    acc = acc.sub(val);
                    break;
                case "mul":
                    acc = acc.mul(val);
                    break;
                case "div":
                    acc = acc.div(val);
                    break;
                case "pow":
                    acc = acc.pow(val);
                    break;
                case "mod":
                    acc = acc.mod(val);
                    break;
                case "divInt":
                    acc = acc.divInt(val);
                    break;
                default: {
                    const unsupported: never = type;
                    throw new CalcAUYError("corrupted-node", `Operação não suportada: ${unsupported}`, {
                        partialAST: parentNode,
                    });
                }
            }
        }

        return acc;
    } catch (err) {
        if (err instanceof CalcAUYError) {
            // Enriquece o erro com a AST parcial se ainda não tiver
            if (!err.context.partialAST) {
                (err.context as { partialAST: unknown }).partialAST = parentNode;
            }
            throw err;
        }
        throw err;
    }
}
