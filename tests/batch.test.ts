import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CalcAUY } from "@src/builder.ts";
import { ProcessBatchAUY } from "@src/utils/batch.ts";

describe("CalcAUY - Batch Processing", () => {
    it("deve processar um lote de itens corretamente", async () => {
        const items = [10, 20, 30, 40, 50];
        const results = await ProcessBatchAUY(items, (val) => {
            return CalcAUY.from(val).add(5).commit().toFloatNumber();
        }, { batchSize: 2 });

        expect(results).toEqual([15, 25, 35, 45, 55]);
    });

    it("deve reportar o progresso corretamente", async () => {
        const items = Array.from({ length: 10 }).map((_, i) => i);
        const progressReports: number[] = [];

        await ProcessBatchAUY(items, (val) => val, {
            batchSize: 2,
            onProgress: (p) => progressReports.push(p),
        });

        // Com batchSize 2 e 10 itens, deve reportar a cada 2 itens (20%, 40%, 60%, 80%) + final (100%)
        expect(progressReports).toContain(20);
        expect(progressReports).toContain(40);
        expect(progressReports).toContain(60);
        expect(progressReports).toContain(80);
        expect(progressReports).toContain(100);
    });

    it("deve processar um AsyncIterable (Streaming) corretamente", async () => {
        // Simulando um gerador assíncrono (Streaming de dados)
        async function* dataStream() {
            yield 10;
            yield 20;
            yield 30;
        }

        const results = await ProcessBatchAUY(dataStream(), (val) => {
            return CalcAUY.from(val).add(10).commit().toFloatNumber();
        }, { batchSize: 1 });

        expect(results).toEqual([20, 30, 40]);
    });

    it("deve reportar progresso em Streaming se totalItems for fornecido", async () => {
        async function* dataStream() {
            for (let i = 0; i < 4; i++) { yield i; }
        }

        const progressReports: number[] = [];
        await ProcessBatchAUY(dataStream(), (val) => val, {
            batchSize: 1,
            totalItems: 4,
            onProgress: (p) => progressReports.push(p),
        });

        // Com batchSize 1 e 4 itens, deve reportar 25, 50, 75, 100
        expect(progressReports).toContain(25);
        expect(progressReports).toContain(50);
        expect(progressReports).toContain(75);
        expect(progressReports).toContain(100);
    });

    it("deve consolidar resultados de um Iterable síncrono usando reducer", async () => {
        function* syncGenerator() {
            yield 100;
            yield 200;
        }

        const total = await ProcessBatchAUY(syncGenerator(), (val) => val, {
            accumulator: 0,
            reducer: (acc, val) => acc + val,
        });

        expect(total).toBe(300);
    });

    it("deve funcionar com grandes volumes sem erros de integridade", async () => {
        const items = Array.from({ length: 5000 }).map(() => "1.5");
        const results = await ProcessBatchAUY(items, (val) => {
            return CalcAUY.from(val).mult(2).commit().toStringNumber({ decimalPrecision: 1 });
        }, { batchSize: 1000 });

        expect(results.length).toBe(5000);
        expect(results[0]).toBe("3.0");
        expect(results[4999]).toBe("3.0");
    });
});
