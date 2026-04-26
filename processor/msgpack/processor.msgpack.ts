import {
    type CalcAUYCustomOutput,
    InternalType,
    type OperationType,
} from "@st-all-one/calc-auy";
import { decode, encode, type ValueType } from "@std/msgpack";

type CalculationNode = InternalType.CalculationNode;
type SerializedCalculation = InternalType.SerializedCalculation;
type LiteralNode = InternalType.LiteralNode;
type OperationNode = InternalType.OperationNode;
type GroupNode = InternalType.GroupNode;
type ControlNode = InternalType.ControlNode;

/**
 * Processador oficial para exportação em formato MessagePack.
 */
export const msgpackProcessor: CalcAUYCustomOutput<Uint8Array> = function (
    ctx,
) {
    const obj = ctx.methods.toLiveTrace();

    if (!obj.finalResult || !obj.roundStrategy) {
        throw new Error(
            "Incomplete Audit Trace: finalResult and roundStrategy are required for serialization.",
        );
    }

    // Engenharia: Construção rigorosa do payload.
    // Usamos Record<string, ValueType> para garantir compatibilidade com encode
    // sem perder a estrutura definida no schema de auditoria.
    const payload: Record<string, ValueType> = {
        ast: transformNode(obj.ast),
        signature: obj.signature,
        contextLabel: obj.contextLabel,
        finalResult: {
            n: obj.finalResult.n,
            d: obj.finalResult.d,
        } as unknown as ValueType,
        roundStrategy: obj.roundStrategy,
    };

    return encode(payload);
};

interface IMsgPackNode {
    kind: number;
    label?: string;
    metadata?: Record<string, unknown>;
    value?: { n: string; d: string };
    originalInput?: string;
    type?: number;
    operands?: IMsgPackNode[];
    child?: IMsgPackNode;
    isRedundant?: boolean;
    previousContextLabel?: string;
    previousSignature?: string;
    previousRoundStrategy?: string;
}

interface IMsgPackPayload {
    ast: IMsgPackNode;
    signature: string;
    contextLabel: string;
    finalResult: { n: string; d: string };
    roundStrategy: string;
}

/**
 * Utilitário para transformar um rastro MessagePack de volta em um objeto AST hidratável.
 */
export function msgpackHydrator(buffer: Uint8Array): SerializedCalculation {
    const decoded = decode(buffer) as unknown as IMsgPackPayload;
    return {
        ast: reverseTransformNode(decoded.ast),
        signature: decoded.signature,
        contextLabel: decoded.contextLabel,
        finalResult: decoded.finalResult,
        roundStrategy: decoded.roundStrategy,
    };
}

function transformNode(node: CalculationNode): ValueType {
    const res: Record<string, ValueType> = {
        kind: (KIND_MAP[node.kind] || 0) as ValueType,
    };

    if (node.label) res.label = node.label;
    if (node.metadata && Object.keys(node.metadata).length > 0) {
        res.metadata = node.metadata as unknown as ValueType;
    }

    if (node.kind === "literal") {
        res.value = {
            n: node.value.n,
            d: node.value.d,
        } as unknown as ValueType;
        res.originalInput = node.originalInput;
    } else if (node.kind === "operation") {
        res.type = (OP_MAP[node.type] || 0) as ValueType;
        res.operands = node.operands.map((o: CalculationNode) =>
            transformNode(o)
        ) as unknown as ValueType;
    } else if (node.kind === "group") {
        res.child = transformNode(node.child);
        if (node.isRedundant !== undefined) res.isRedundant = node.isRedundant;
    } else if (node.kind === "control") {
        res.type = node.type;
        res.child = transformNode(node.child);
        // Os metadados de controle são obrigatórios no schema
        res.previousContextLabel = node.metadata
            .previousContextLabel as ValueType;
        res.previousSignature = node.metadata.previousSignature as ValueType;
        res.previousRoundStrategy =
            (node.metadata.previousRoundStrategy as string || "") as ValueType;
    }
    return res as ValueType;
}

const KIND_MAP: Record<string, number> = {
    literal: 1,
    operation: 2,
    group: 3,
    control: 4,
};

const OP_MAP: Record<string, number> = {
    add: 1,
    sub: 2,
    mul: 3,
    div: 4,
    pow: 5,
    mod: 6,
    divInt: 7,
    crossContextAdd: 8,
};

const REV_KIND_MAP: Record<number, string> = {
    1: "literal",
    2: "operation",
    3: "group",
    4: "control",
};

const REV_OP_MAP: Record<number, OperationType> = {
    1: "add",
    2: "sub",
    3: "mul",
    4: "div",
    5: "pow",
    6: "mod",
    7: "divInt",
    8: "crossContextAdd",
};

function reverseTransformNode(node: IMsgPackNode): CalculationNode {
    const kind = REV_KIND_MAP[node.kind] || "literal";

    const base = {
        label: node.label,
        metadata: node.metadata as any,
    };

    if (kind === "literal" && node.value) {
        return {
            ...base,
            kind: "literal",
            value: node.value,
            originalInput: node.originalInput || "",
        } as LiteralNode;
    }

    if (kind === "operation" && node.type && node.operands) {
        return {
            ...base,
            kind: "operation",
            type: REV_OP_MAP[node.type] || "add",
            operands: node.operands.map((o) => reverseTransformNode(o)),
        } as OperationNode;
    }

    if (kind === "group" && node.child) {
        return {
            ...base,
            kind: "group",
            child: reverseTransformNode(node.child),
            isRedundant: node.isRedundant,
        } as GroupNode;
    }

    if (kind === "control" && node.child) {
        return {
            ...base,
            kind: "control",
            type: "reanimation_event",
            child: reverseTransformNode(node.child),
            metadata: {
                ...base.metadata,
                previousContextLabel: node.previousContextLabel || "",
                previousSignature: node.previousSignature || "",
                previousRoundStrategy: node.previousRoundStrategy || "",
            },
        } as ControlNode;
    }

    throw new Error(
        `Invalid node structure during MsgPack hydration: ${node.kind}`,
    );
}
