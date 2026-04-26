import {
    type CalcAUYCustomOutput,
    InternalType,
    type OperationType,
} from "@st-all-one/calc-auy";
import { type CborType, decodeCbor, encodeCbor } from "@std/cbor";

type CalculationNode = InternalType.CalculationNode;
type SerializedCalculation = InternalType.SerializedCalculation;
type LiteralNode = InternalType.LiteralNode;
type OperationNode = InternalType.OperationNode;
type GroupNode = InternalType.GroupNode;
type ControlNode = InternalType.ControlNode;

/**
 * Processador oficial para exportação em formato binário CBOR (RFC 8949).
 */
export const cborProcessor: CalcAUYCustomOutput<Uint8Array> = function (ctx) {
    const obj = ctx.methods.toLiveTrace();

    if (!obj.finalResult || !obj.roundStrategy) {
        throw new Error(
            "Incomplete Audit Trace: finalResult and roundStrategy are required for serialization.",
        );
    }

    // Engenharia: Construção rigorosa do payload.
    // Usamos Record<string, CborType> para garantir compatibilidade com encodeCbor
    // sem perder a estrutura definida no schema de auditoria.
    const payload: Record<string, CborType> = {
        ast: transformNode(obj.ast),
        signature: obj.signature,
        contextLabel: obj.contextLabel,
        finalResult: {
            n: obj.finalResult.n,
            d: obj.finalResult.d,
        } as unknown as CborType,
        roundStrategy: obj.roundStrategy,
    };

    return encodeCbor(payload);
};

interface ICborNode {
    kind: number;
    label?: string;
    metadata?: Record<string, unknown>;
    value?: { n: string; d: string };
    originalInput?: string;
    type?: number;
    operands?: ICborNode[];
    child?: ICborNode;
    isRedundant?: boolean;
    previousContextLabel?: string;
    previousSignature?: string;
    previousRoundStrategy?: string;
}

interface ICborPayload {
    ast: ICborNode;
    signature: string;
    contextLabel: string;
    finalResult: { n: string; d: string };
    roundStrategy: string;
}

/**
 * Utilitário para reanimar cálculos a partir de buffers CBOR.
 */
export function cborHydrator(buffer: Uint8Array): SerializedCalculation {
    const decoded = decodeCbor(buffer) as unknown as ICborPayload;
    return {
        ast: reverseTransformNode(decoded.ast),
        signature: decoded.signature,
        contextLabel: decoded.contextLabel,
        finalResult: decoded.finalResult,
        roundStrategy: decoded.roundStrategy,
    };
}

function transformNode(node: CalculationNode): CborType {
    const res: Record<string, CborType> = {
        kind: (KIND_MAP[node.kind] || 0) as CborType,
    };

    if (node.label) res.label = node.label;
    if (node.metadata && Object.keys(node.metadata).length > 0) {
        res.metadata = node.metadata as unknown as CborType;
    }

    if (node.kind === "literal") {
        res.value = { n: node.value.n, d: node.value.d } as unknown as CborType;
        res.originalInput = node.originalInput;
    } else if (node.kind === "operation") {
        res.type = (OP_MAP[node.type] || 0) as CborType;
        res.operands = node.operands.map((o: CalculationNode) =>
            transformNode(o)
        ) as unknown as CborType;
    } else if (node.kind === "group") {
        res.child = transformNode(node.child);
        if (node.isRedundant !== undefined) res.isRedundant = node.isRedundant;
    } else if (node.kind === "control") {
        res.type = node.type;
        res.child = transformNode(node.child);
        res.previousContextLabel = node.metadata
            .previousContextLabel as CborType;
        res.previousSignature = node.metadata.previousSignature as CborType;
        res.previousRoundStrategy =
            (node.metadata.previousRoundStrategy as string || "") as CborType;
    }
    return res as CborType;
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

function reverseTransformNode(node: ICborNode): CalculationNode {
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
        `Invalid node structure during CBOR hydration: ${node.kind}`,
    );
}
