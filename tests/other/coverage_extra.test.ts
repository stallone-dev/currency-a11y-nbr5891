import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows, assertRejects } from "@std/assert";
import { RationalNumber } from "@src/core/rational.ts";
import { applyRounding } from "@src/core/rounding.ts";
import { CalcAUYError } from "@src/core/errors.ts";
import { sanitizeAST, sanitizeObject } from "@src/utils/sanitizer.ts";
import { evaluate } from "@src/ast/engine.ts";
import { CalcAUY } from "@src/main.ts";
import { validateASTNode } from "@src/ast/builder_utils.ts";

describe("Coverage: Extra Edge Cases", () => {
    it("RationalNumber.from: should return same instance if already a RationalNumber", () => {
        const r1 = RationalNumber.from(1);
        const r2 = RationalNumber.from(r1);
        assertEquals(r1, r2);
    });

    it("RationalNumber.pow: should handle 0 to positive power", () => {
        const zero = RationalNumber.from(0);
        const pos = RationalNumber.from(2);
        assertEquals(zero.pow(pos).toDecimalString(0), "0");
    });

    it("RationalNumber.toDecimalString: should throw on negative precision", () => {
        const r = RationalNumber.from(1);
        assertThrows(() => r.toDecimalString(-1), CalcAUYError, "Precisão não pode ser negativa.");
    });

    it("RationalNumber nthRoot: should handle 0 and 1 explicitly", () => {
        assertEquals(RationalNumber.from(0).pow(RationalNumber.from("1/2")).toDecimalString(0), "0");
        assertEquals(RationalNumber.from(1).pow(RationalNumber.from("1/2")).toDecimalString(0), "1");
        assertEquals(RationalNumber.from(8).pow(RationalNumber.from("1/1")).toDecimalString(0), "8");
    });

    it("RationalNumber GCD: handle u=0", () => {
        // @ts-ignore
        assertEquals(RationalNumber.from(0).add(RationalNumber.from(5)).toJSON().n, "5");
    });

    it("applyRounding: should handle HALF_UP cases", () => {
        const val1 = RationalNumber.from("1.25");
        assertEquals(applyRounding(val1, "HALF_UP", 1).toDecimalString(1), "1.3");
        const val2 = RationalNumber.from("1.24");
        assertEquals(applyRounding(val2, "HALF_UP", 1).toDecimalString(1), "1.2");
        const val3 = RationalNumber.from("1.251");
        assertEquals(applyRounding(val3, "NBR5891", 1).toDecimalString(1), "1.3");
    });

    it("Sanitizer: should handle edge cases", () => {
        // @ts-ignore
        assertEquals(sanitizeAST(null), { kind: "null" });
        
        const obj: any = { a: 1 };
        obj.self = obj;
        assertEquals((sanitizeObject(obj) as any).self, "[CIRCULAR]");
        
        const arr = [1, "123", { a: 1 }];
        const sanitizedArr = sanitizeObject(arr) as any;
        assertEquals(sanitizedArr[0], "[PII]");

        assertEquals(sanitizeObject("A".repeat(51)), "[PII]");
        assertEquals(sanitizeObject("123.45"), "[PII]");
        
        const config = { contextLabel: "test", salt: "s", sensitive: false };
        assertEquals((sanitizeObject({ a: 1 }, config) as any).a, 1);
    });

    it("Engine & Validator: should throw on corrupt nodes", async () => {
        // Empty operands
        const node1 = { kind: "operation", type: "add", operands: [] };
        // @ts-ignore
        assertThrows(() => evaluate(node1), CalcAUYError);
        // @ts-ignore
        assertThrows(() => validateASTNode(node1), CalcAUYError);

        // Unsupported op
        const node2 = { kind: "operation", type: "invalid", operands: [{ kind: "literal", value: { n: "1", d: "1" } }] };
        // @ts-ignore
        assertThrows(() => evaluate(node2), CalcAUYError);

        // Unknown kind
        const node3 = { kind: "unknown" };
        // @ts-ignore
        assertThrows(() => evaluate(node3), CalcAUYError);
        // @ts-ignore
        assertThrows(() => validateASTNode(node3), CalcAUYError);

        // Max depth
        const deepNode = { kind: "group", child: { kind: "literal", value: { n: "1", d: "1" } } };
        assertThrows(() => validateASTNode(deepNode, 1000), CalcAUYError);
    });

    it("Output Formatting: roots and fractions", async () => {
        const engine = CalcAUY.create({ contextLabel: "test", salt: "s" });
        const res = await engine.from("1/2").pow("1/2").commit();
        
        const latex = res.toLaTeX();
        assertEquals(latex.includes("\\sqrt"), true);
        assertEquals(latex.includes("\\frac"), true);

        const unicode = res.toUnicode();
        assertEquals(unicode.includes("√"), true);

        const verbal = res.toVerbalA11y();
        assertEquals(verbal.includes("raiz quadrada"), true);
    });

    it("Output: toJSON edge cases", async () => {
        const engine = CalcAUY.create({ contextLabel: "test", salt: "s" });
        const res = await engine.from(100).commit();
        const json = JSON.parse(res.toJSON(["toMonetary"]));
        assertEquals(json.toMonetary !== undefined, true);
    });

    it("Slicing: invalid parts", async () => {
        const engine = CalcAUY.create({ contextLabel: "test", salt: "s" });
        const res = await engine.from(100).commit();
        assertThrows(() => res.toSlice(0), CalcAUYError);
        assertEquals(res.toSliceByRatio([]).length, 0);
    });

    it("Main & Hydrate: error cases", async () => {
        assertThrows(() => CalcAUY.create({ contextLabel: "" } as any), CalcAUYError);
        
        await assertRejects(() => CalcAUY.checkIntegrity("invalid json", { salt: "s" }), CalcAUYError);
        // @ts-ignore
        await assertRejects(() => CalcAUY.checkIntegrity({ salt: "s" }, { salt: "s" }), CalcAUYError);
    });
});
