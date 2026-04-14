import { CalcAUY } from "../mod.ts";
import { assertEquals } from "https://deno.land/std@0.221.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.221.0/testing/bdd.ts";

const TOTAL_OBJECTS = 100_000;

describe("Benchmark: Acúmulo Massivo (Reducer)", () => {
    it(`deve processar e acumular ${TOTAL_OBJECTS.toLocaleString()} itens usando logicalWorkers e Reducer nativo`, async () => {
        const start = performance.now();

        const items = Array.from({ length: TOTAL_OBJECTS }, (_, i) => i);

        const result = await CalcAUY.processBatch(items, (i: number) => {
            return CalcAUY.from(i).add(1);
        }, {
            batchSize: 5000,
            logicalWorkers: 4,
            accumulator: CalcAUY.from(0),
            reducer: (acc: CalcAUY, val: CalcAUY) => acc.add(val),
        }) as CalcAUY;

        const output = result.commit();
        const end = performance.now();

        const totalAcumulado = output.toStringNumber({ decimalPrecision: 4 });
        const expected = ((TOTAL_OBJECTS * (TOTAL_OBJECTS + 1)) / 2).toFixed(4);

        console.log(
            `\n[Massive Accumulation] Tempo para ${TOTAL_OBJECTS.toLocaleString()} itens: ${
                (end - start).toFixed(2)
            }ms`,
        );

        assertEquals(totalAcumulado, expected);
    });
});
