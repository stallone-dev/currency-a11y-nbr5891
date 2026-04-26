/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { CalculationNode } from "../ast/types.ts";
import type { CalcAUYLocaleA11y } from "./types.ts";
import { toSuperscript } from "./unicode.ts";

/**
 * Helper to extract fractional power information from a node.
 */
function getRootInfo(node: CalculationNode): { num: string; den: string } | null {
    if (node.kind === "group") {
        return getRootInfo(node.child);
    }
    if (node.kind === "literal" && node.originalInput.includes("/")) {
        const parts = node.originalInput.split("/");
        if (parts.length === 2) {
            return { num: parts[0], den: parts[1] };
        }
    }
    return null;
}

/**
 * Normaliza a string de input original para garantir legibilidade matemática.
 * Ex: ".5" -> "0.5", "-.5" -> "-0.5"
 */
function normalizeInput(input: string): string {
    if (input.startsWith(".")) {
        return "0" + input;
    }
    if (input.startsWith("-.")) {
        return "-0" + input.slice(1);
    }
    return input;
}

/**
 * Recursively renders an AST node into a specific format.
 */
export function renderAST(
    node: CalculationNode,
    format: "latex" | "unicode" | "verbal",
    loc?: CalcAUYLocaleA11y,
    forceCaret = false,
): string {
    if (node.kind === "literal") {
        let input = normalizeInput(node.originalInput);
        if (format === "latex") {
            // Escapar % para LaTeX para evitar comentários
            input = input.replace(/%/g, String.raw`\%`);
            if (input.includes("/")) {
                const [n, d] = input.split("/");
                return String.raw`\frac{${n}}{${d}}`;
            }
        }
        return input;
    }

    if (node.kind === "group") {
        const inner: string = renderAST(node.child, format, loc, forceCaret);
        if (format === "latex") { return String.raw`\left( ${inner} \right)`; }
        if (format === "verbal" && loc) { return `${loc.operators.group_start} ${inner} ${loc.operators.group_end}`; }
        return `(${inner})`;
    }

    if (node.kind === "control") {
        return renderAST(node.child, format, loc, forceCaret);
    }

    const operands = node.operands;
    const ops: string[] = operands.map((o, i) => {
        const isExp = node.type === "pow" && i === 1;
        const nextForce = format === "unicode" && isExp;
        return renderAST(o, format, loc, forceCaret || nextForce);
    });

    if (node.type === "pow") {
        const root = getRootInfo(operands[1]);
        if (root) {
            const { num, den } = root;
            if (format === "latex") {
                const inner = num === "1" ? ops[0] : String.raw`{${ops[0]}}^{${num}}`;
                return den === "2" ? String.raw`\sqrt{${inner}}` : String.raw`\sqrt[${den}]{${inner}}`;
            }
            if (format === "unicode") {
                let baseWithPow: string;
                if (num === "1") {
                    baseWithPow = ops[0];
                } else if (forceCaret) {
                    // Use caret to avoid ambiguity in nested superscripts
                    baseWithPow = `(${ops[0]}^${num})`;
                } else {
                    baseWithPow = `(${ops[0]}${toSuperscript(num)})`;
                }

                if (den === "2") { return `√${baseWithPow}`; }
                if (den === "3") { return `∛${baseWithPow}`; }
                if (den === "4") { return `∜${baseWithPow}`; }
                return `${toSuperscript(den)}√${baseWithPow}`;
            }
            if (format === "verbal" && loc) {
                const baseVerbal = num === "1" ? ops[0] : `${ops[0]} ${loc.operators.pow} ${num}`;
                if (den === "2") { return `${loc.phrases.root_square}${baseVerbal}`; }
                if (den === "3") { return `${loc.phrases.root_cubic}${baseVerbal}`; }
                const rootN = loc.phrases.root_n.replace("{den}", den);
                return `${rootN}${baseVerbal}`;
            }
        }
    }

    if (format === "latex") {
        if (node.type === "div") { return String.raw`\frac{${ops[0]}}{${ops[1]}}`; }
        if (node.type === "pow") { return String.raw`${ops[0]}^{${ops[1]}}`; }
        const symbols: Record<string, string> = {
            add: "+",
            sub: "-",
            mul: String.raw`\times`,
            mod: String.raw`\bmod`,
            divInt: "//",
            crossContextAdd: "+",
        };
        return ops.join(` ${symbols[node.type]} `);
    }

    if (format === "unicode") {
        if (node.type === "pow") {
            if (forceCaret) {
                return `(${ops[0]}^${ops[1]})`;
            }
            return `${ops[0]}${toSuperscript(ops[1])}`;
        }
        const symbols: Record<string, string> = {
            add: "+",
            sub: "-",
            mul: "×",
            div: "÷",
            mod: "%",
            divInt: "//",
            crossContextAdd: "+",
        };
        return ops.join(` ${symbols[node.type]} `);
    }

    if (format === "verbal" && loc) {
        const type = node.type === "crossContextAdd" ? "add" : node.type;
        return ops.join(` ${loc.operators[type]} `);
    }

    const symbols: Record<string, string> = {
        add: "+",
        sub: "-",
        mul: "*",
        div: "/",
        pow: "^",
        mod: "%",
        divInt: "//",
        crossContextAdd: "+",
    };
    return ops.join(` ${symbols[node.type]} `);
}
