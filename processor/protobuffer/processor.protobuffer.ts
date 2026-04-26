import {
    type CalcAUYCustomOutput,
    InternalType,
    type OperationType,
} from "@st-all-one/calc-auy";
import protobuf from "protobufjs";

type CalculationNode = InternalType.CalculationNode;
type SerializedCalculation = InternalType.SerializedCalculation;
type LiteralNode = InternalType.LiteralNode;
type OperationNode = InternalType.OperationNode;
type GroupNode = InternalType.GroupNode;
type ControlNode = InternalType.ControlNode;
type MetadataValue = InternalType.MetadataValue;

const PROTO_DEF = `
syntax = "proto3";
package calc_auy;
enum OperationType {
  OPERATION_UNSPECIFIED = 0;
  OPERATION_ADD = 1;
  OPERATION_SUB = 2;
  OPERATION_MUL = 3;
  OPERATION_DIV = 4;
  OPERATION_POW = 5;
  OPERATION_MOD = 6;
  OPERATION_DIV_INT = 7;
  OPERATION_CROSS_CONTEXT_ADD = 8;
}
message RationalValue { string n = 1; string d = 2; }
message MetadataValue {
  oneof value {
    string string_val = 1;
    double double_val = 2;
    bool bool_val = 3;
    MetadataList array_val = 4;
    MetadataMap object_val = 5;
  }
}
message MetadataList { repeated MetadataValue items = 1; }
message MetadataMap { map<string, MetadataValue> fields = 1; }
message CalculationNode {
  string kind = 1;
  string label = 2;
  map<string, MetadataValue> metadata = 3;
  oneof node_type {
    LiteralNode literal = 4;
    OperationNode operation = 5;
    GroupNode group = 6;
    ControlNode control = 7;
  }
}
message LiteralNode { RationalValue value = 1; string originalInput = 2; }
message OperationNode { OperationType type = 1; repeated CalculationNode operands = 2; }
message GroupNode { CalculationNode child = 1; bool isRedundant = 2; }
message ControlNode { string type = 1; string previousContextLabel = 2; string previousSignature = 3; string previousRoundStrategy = 4; CalculationNode child = 5; }
message SerializedCalculation {
  CalculationNode ast = 1;
  string signature = 2;
  string context_label = 3;
  RationalValue final_result = 4;
  string round_strategy = 5;
}
`;

const root = protobuf.parse(PROTO_DEF).root;
const SerializedCalculationMsg = root.lookupType(
    "calc_auy.SerializedCalculation",
);

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

/**
 * Interface rigorosa para representação intermediária do Protobuf.
 */
interface IProtoNode {
    kind: string;
    label: string;
    metadata: Record<string, unknown>;
    literal?: { value: { n: string; d: string }; originalInput: string };
    operation?: { type: number; operands: IProtoNode[] };
    group?: { child: IProtoNode; isRedundant: boolean };
    control?: {
        type: string;
        child: IProtoNode;
        previousContextLabel: string;
        previousSignature: string;
        previousRoundStrategy: string;
    };
}

interface IProtoPayload {
    ast: IProtoNode;
    signature: string;
    contextLabel: string;
    finalResult: { n: string; d: string };
    roundStrategy: string;
}

/**
 * Processador oficial para exportação em formato Protobuf v3.
 */
export const protobufProcessor: CalcAUYCustomOutput<Uint8Array> = function (
    ctx,
) {
    const obj = ctx.methods.toLiveTrace();

    if (!obj.finalResult || !obj.roundStrategy) {
        throw new Error(
            "Incomplete Audit Trace: finalResult and roundStrategy are required for serialization.",
        );
    }

    const payload: IProtoPayload = {
        ast: transformNode(obj.ast),
        signature: obj.signature,
        contextLabel: obj.contextLabel,
        finalResult: { n: obj.finalResult.n, d: obj.finalResult.d },
        roundStrategy: obj.roundStrategy,
    };

    const message = SerializedCalculationMsg.create(payload);
    return SerializedCalculationMsg.encode(message).finish();
};

/**
 * Utilitário para transformar um rastro Protobuf de volta em um objeto AST hidratável.
 */
export function protobufHydrator(buffer: Uint8Array): SerializedCalculation {
    const decoded = SerializedCalculationMsg.decode(buffer);
    const plain = SerializedCalculationMsg.toObject(decoded, {
        enums: String,
        longs: String,
        defaults: true,
        oneofs: true,
    }) as unknown as {
        ast: IProtoNode;
        signature: string;
        context_label: string;
        final_result: { n: string; d: string };
        round_strategy: string;
    };

    return {
        ast: reverseTransformNode(plain.ast),
        signature: plain.signature,
        contextLabel: plain.context_label,
        finalResult: plain.final_result,
        roundStrategy: plain.round_strategy,
    };
}

function transformNode(node: CalculationNode): IProtoNode {
    const res: IProtoNode = {
        kind: node.kind,
        label: node.label || "",
        metadata: transformMetadata(node.metadata || {}),
    };

    if (node.kind === "literal") {
        res.literal = {
            value: { n: node.value.n, d: node.value.d },
            originalInput: node.originalInput,
        };
    } else if (node.kind === "operation") {
        res.operation = {
            type: OP_MAP[node.type] || 0,
            operands: node.operands.map((o: CalculationNode) =>
                transformNode(o)
            ),
        };
    } else if (node.kind === "group") {
        res.group = {
            child: transformNode(node.child),
            isRedundant: !!node.isRedundant,
        };
    } else if (node.kind === "control") {
        res.control = {
            type: node.type,
            child: transformNode(node.child),
            previousContextLabel: node.metadata.previousContextLabel,
            previousSignature: node.metadata.previousSignature,
            previousRoundStrategy:
                node.metadata.previousRoundStrategy as string || "",
        };
    }
    return res;
}

function reverseTransformNode(node: IProtoNode): CalculationNode {
    const base = {
        label: node.label !== "" ? node.label : undefined,
        metadata: unwrapMetadata(node.metadata),
    };

    if (node.literal) {
        return {
            ...base,
            kind: "literal",
            value: node.literal.value,
            originalInput: node.literal.originalInput,
        } as LiteralNode;
    }

    if (node.operation) {
        return {
            ...base,
            kind: "operation",
            type: REV_OP_MAP[node.operation.type] || "add",
            operands: node.operation.operands.map((o) =>
                reverseTransformNode(o)
            ),
        } as OperationNode;
    }

    if (node.group) {
        return {
            ...base,
            kind: "group",
            child: reverseTransformNode(node.group.child),
            isRedundant: node.group.isRedundant,
        } as GroupNode;
    }

    if (node.control) {
        return {
            ...base,
            kind: "control",
            type: "reanimation_event",
            child: reverseTransformNode(node.control.child),
            metadata: {
                ...base.metadata,
                previousContextLabel: node.control.previousContextLabel,
                previousSignature: node.control.previousSignature,
                previousRoundStrategy: node.control.previousRoundStrategy,
            },
        } as ControlNode;
    }

    throw new Error(
        `Invalid node structure during Protobuf hydration: ${node.kind}`,
    );
}

function transformMetadata(
    meta: Record<string, MetadataValue>,
): Record<string, unknown> {
    const fields: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(meta)) {
        fields[key] = wrapValue(val);
    }
    return fields;
}

function unwrapMetadata(
    meta: Record<string, any>,
): Record<string, MetadataValue> {
    const res: Record<string, MetadataValue> = {};
    for (const [key, val] of Object.entries(meta)) {
        res[key] = unwrapValue(val);
    }
    return res;
}

function wrapValue(val: MetadataValue): unknown {
    if (typeof val === "string") return { stringVal: val };
    if (typeof val === "number") return { doubleVal: val };
    if (typeof val === "boolean") return { boolVal: val };
    if (Array.isArray(val)) return { arrayVal: { items: val.map(wrapValue) } };
    if (typeof val === "object" && val !== null) {
        const fields: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = wrapValue(v);
        }
        return { objectVal: { fields } };
    }
    return { stringVal: String(val) };
}

function unwrapValue(val: any): MetadataValue {
    if (val.stringVal !== undefined) return val.stringVal;
    if (val.doubleVal !== undefined) return val.doubleVal;
    if (val.boolVal !== undefined) return val.boolVal;
    if (val.arrayVal !== undefined) return val.arrayVal.items.map(unwrapValue);
    if (val.objectVal !== undefined) {
        const res: Record<string, MetadataValue> = {};
        for (const [k, v] of Object.entries(val.objectVal.fields || {})) {
            res[k] = unwrapValue(v);
        }
        return { objectVal: res };
    }
    return "";
}
