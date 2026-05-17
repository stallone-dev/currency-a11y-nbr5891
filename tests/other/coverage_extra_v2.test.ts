import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows, assertRejects } from "@std/assert";
import { RationalNumber } from "@src/core/rational.ts";
import { applyRounding, roundToPrecisionNBR5891 } from "@src/core/rounding.ts";
import { CalcAUYError } from "@src/core/errors.ts";
import { sanitizeAST, sanitizeObject } from "@src/utils/sanitizer.ts";
import { CalcAUY } from "@src/main.ts";
import { generateSignature } from "@src/utils/security.ts";
import { cborProcessor, cborHydrator } from "@processor/cbor/processor.cbor.ts";
import { persistenceProcessor } from "@processor/persistence/processor.persistence.ts";
import { msgpackProcessor, msgpackHydrator } from "@processor/msgpack/processor.msgpack.ts";
import { protobufProcessor, protobufHydrator } from "@processor/protobuffer/processor.protobuffer.ts";
import { configure, getConsoleSink } from "@logtape";

describe("Coverage: Rodada 2 - Processadores e Core", () => {
    it("CBOR Processor: deve cobrir group, control e erros", async () => {
        const engine = CalcAUY.create({ contextLabel: "cbor-extra", salt: "s" });
        const original = await engine.from(10).hibernate();
        const reanimated = await engine.hydrate(original);
        const res = await reanimated.group().commit();
        
        const buffer = res.toCustomOutput(cborProcessor);
        const hydratedObj = cborHydrator(buffer);
        assertEquals(hydratedObj.contextLabel, "cbor-extra");
        
        const mockCtx = { methods: { toLiveTrace: () => ({ contextLabel: "m" }) } };
        // @ts-ignore
        assertThrows(() => cborProcessor(mockCtx as any), Error, "Incomplete Audit Trace");
        assertThrows(() => cborHydrator(new Uint8Array([0xBF, 0x64, 0x6B, 0x69, 0x6E, 0x64, 0x09, 0xFF])), Error);
    });

    it("MsgPack Processor: deve cobrir group, control e erros", async () => {
        const engine = CalcAUY.create({ contextLabel: "msg-extra", salt: "s" });
        const original = await engine.from(10).hibernate();
        const reanimated = await engine.hydrate(original);
        const res = await reanimated.group().commit();
        
        const buffer = res.toCustomOutput(msgpackProcessor);
        const hydratedObj = msgpackHydrator(buffer);
        assertEquals(hydratedObj.contextLabel, "msg-extra");
        
        const mockCtx = { methods: { toLiveTrace: () => ({ contextLabel: "m" }) } };
        // @ts-ignore
        assertThrows(() => msgpackProcessor(mockCtx as any), Error, "Incomplete Audit Trace");
        assertThrows(() => msgpackHydrator(new Uint8Array([0x81, 0xA4, 0x6B, 0x69, 0x6E, 0x64, 0x09])), Error);
    });

    it("Protobuf Processor: deve cobrir group, control, complex metadata e erros", async () => {
        const engine = CalcAUY.create({ contextLabel: "proto-extra", salt: "s" });
        // Set metadata on a node we'll find at the root
        const res = await engine.from(10).setMetadata("complex", { a: [true, false], b: "s" }).commit();
        
        const buffer = res.toCustomOutput(protobufProcessor);
        const hydratedObj = protobufHydrator(buffer);
        assertEquals(hydratedObj.contextLabel, "proto-extra");
        assertEquals((hydratedObj.ast.metadata as any).complex.a[0], true);
        assertEquals((hydratedObj.ast.metadata as any).complex.b, "s");
        
        // Test control node specifically in Protobuf
        const h = await engine.from(5).hibernate();
        const re = await engine.hydrate(h);
        const res2 = await re.commit();
        const buf2 = res2.toCustomOutput(protobufProcessor);
        const hyd2 = protobufHydrator(buf2);
        assertEquals(hyd2.ast.kind, "group");
        // @ts-ignore
        assertEquals(hyd2.ast.child.kind, "control");

        const mockCtx = { methods: { toLiveTrace: () => ({ contextLabel: "m" }) } };
        // @ts-ignore
        assertThrows(() => protobufProcessor(mockCtx as any), Error, "Incomplete Audit Trace");
        assertThrows(() => protobufHydrator(new Uint8Array([0x08, 0x09])), Error);
    });

    it("Persistence Processor: erro de finalResult", () => {
        const mockCtx = { methods: { toLiveTrace: () => ({ contextLabel: "m" }) } };
        // @ts-ignore
        assertThrows(() => persistenceProcessor(mockCtx as any), Error, "Persistence error");
    });

    it("Security Utils: Date e Encoders", async () => {
        const d = new Date("2026-01-01T00:00:00.000Z");
        const sig1 = await generateSignature(d, "salt", "HEX");
        const sig2 = await generateSignature(d, "salt", "BASE64");
        const sig3 = await generateSignature(d, "salt", "BASE32");
        const sig4 = await generateSignature(d, "salt", "BASE58");
        
        assertEquals(typeof sig1, "string");
        assertEquals(typeof sig2, "string");
        assertEquals(typeof sig3, "string");
        assertEquals(typeof sig4, "string");
    });

    it("Rounding: HALF_EVEN parity e NBR5891 util", () => {
        assertEquals(applyRounding(RationalNumber.from("1.5"), "HALF_EVEN", 0).toDecimalString(0), "2");
        assertEquals(applyRounding(RationalNumber.from("2.5"), "HALF_EVEN", 0).toDecimalString(0), "2");
        assertEquals(applyRounding(RationalNumber.from("-1.5"), "HALF_EVEN", 0).toDecimalString(0), "-2");

        assertEquals(roundToPrecisionNBR5891(100n, 2, 2), 100n);
        assertEquals(roundToPrecisionNBR5891(100n, 2, 3), 1000n);
        assertEquals(roundToPrecisionNBR5891(-85487n, 2, 1), -8549n);
    });

    it("Sanitizer: group e control nodes", async () => {
        const engine = CalcAUY.create({ contextLabel: "san-extra", salt: "s" });
        const h = await engine.from(10).hibernate();
        const r = await engine.hydrate(h);
        const res = await r.group().commit();
        
        // @ts-ignore
        const sanitized = sanitizeAST(res.toLiveTrace().ast);
        assertEquals((sanitized as any).kind, "group");
        assertEquals((sanitized as any).child.kind, "control");
        
        assertEquals(sanitizeObject(null), null);
        assertEquals(sanitizeObject(undefined), undefined);
        
        const nested = { myAst: res.toLiveTrace().ast };
        const sanNested = sanitizeObject(nested) as any;
        assertEquals(sanNested.myAst.kind, "group");
    });

    it("Renderer: raízes e frações complexas", async () => {
        const engine = CalcAUY.create({ contextLabel: "render-extra", salt: "s" });
        
        const res3 = await engine.from(8).pow("1/3").commit();
        assertEquals(res3.toUnicode().includes("∛"), true);
        assertEquals(res3.toVerbalA11y({ locale: "pt-BR" }).includes("raiz cúbica"), true);
        
        const res4 = await engine.from(16).pow("1/4").commit();
        assertEquals(res4.toUnicode().includes("∜"), true);
        
        const res5 = await engine.from(32).pow("1/5").commit();
        assertEquals(res5.toUnicode().includes("√"), true);
        assertEquals(res5.toVerbalA11y({ locale: "pt-BR" }).includes("raiz 5-ésima"), true);

        const resFrac = await engine.from("3/4").commit();
        assertEquals(resFrac.toLaTeX().includes("frac"), true);
        
        const resNegDot = await engine.from("-.5").commit();
        assertEquals(resNegDot.toStringNumber({ decimalPrecision: 1 }), "-0.5");
    });

    it("Mermaid Renderer: transitions", async () => {
        const Branch = CalcAUY.create({ contextLabel: "branch", salt: "s1" });
        const HQ = CalcAUY.create({ contextLabel: "hq", salt: "s2" });
        const b = await Branch.from(100).hibernate();
        const hq = await HQ.fromExternalInstance(b);
        const res = await hq.add(50).commit();
        
        const mermaid = res.toMermaidGraph({ locale: "fr-FR" });
        assertEquals(mermaid.includes("activate"), true);
        assertEquals(mermaid.includes("deactivate"), true);
        assertEquals(mermaid.includes("Passage"), true);
    });

    it("Engine: recursion depth e logs", async () => {
        // Ativar logs para cobertura
        // @ts-ignore
        await configure({
            sinks: { console: getConsoleSink() },
            filters: {},
            loggers: [{ category: ["calc-auy"], lowestLevel: "debug", sinks: ["console"] }],
        });

        const engine = CalcAUY.create({ contextLabel: "engine-extra", salt: "s" });
        let builder = engine.from(1);
        for(let i=0; i<505; i++) {
            builder = builder.group().add(1);
        }
        
        await assertRejects(() => builder.commit(), CalcAUYError, "A profundidade da expressão excedeu o limite de segurança");
    });
});
