import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { CalcAUY } from "@calcauy";
import { msgpackHydrator, msgpackProcessor } from "@processor/msgpack";
import { protobufHydrator, protobufProcessor } from "@processor/protobuffer";

describe("Integração: Fluxo de Reanimação Binária", () => {
    const salt = "chave-secreta-forense";

    it("deve reanimar um cálculo via MessagePack e permitir continuidade (Fluxo Linear)", async () => {
        const Calc = CalcAUY.create({ contextLabel: "vendas", salt });

        // 1. Cálculo Inicial: 100 + 50 = 150
        const inicial = await Calc.from(100).add(50).commit();
        assertEquals(inicial.toStringNumber(), "150.00");

        // 2. Serialização
        const binary = inicial.toCustomOutput(msgpackProcessor);

        // 3. Desserialização e Reanimação
        const astObject = msgpackHydrator(binary);
        const reanimado = await Calc.hydrate(astObject, { salt });

        // 4. Continuidade: (150) * 2 = 300
        // Como o hydrate retorna uma instância que representa o rastro completo,
        // qualquer operação subsequente envolve o rastro anterior.
        const final = await reanimado.mult(2).commit();
        assertEquals(final.toStringNumber(), "300.00");
    });

    it("deve reanimar um cálculo via Protobuf e permitir continuidade (Fluxo Linear)", async () => {
        const Calc = CalcAUY.create({ contextLabel: "financeiro", salt });

        // 1. Cálculo Inicial: 1000 (com metadata)
        const inicial = await Calc.from(1000).setMetadata("id", "TX-1").commit();

        // 2. Serialização Protobuf
        const buffer = inicial.toCustomOutput(protobufProcessor);

        // 3. Reanimação
        const astObject = protobufHydrator(buffer);
        const reanimado = await Calc.hydrate(astObject, { salt });

        // 4. Continuidade: (1000) - 200 = 800
        const final = await reanimado.sub(200).commit();
        assertEquals(final.toStringNumber(), "800.00");

        const live = final.toLiveTrace();
        assertEquals(live.ast.operands[0].kind, "control");
        assertEquals(live.ast.operands[0].metadata.previousContextLabel, "financeiro");
    });
});
