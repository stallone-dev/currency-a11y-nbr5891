import { CalcAUY, CalcAUYLogic } from "@st-all-one/calc-auy";
import { cborProcessor } from "@st-all-one/calc-auy-processor-cbor";
import { msgpackProcessor } from "@st-all-one/calc-auy-processor-msgpack";
import { protobufProcessor } from "@st-all-one/calc-auy-processor-protobuf";
import { DB } from "@sqlite";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

const TOTAL_ITEMS = 100_000;
const Engine = CalcAUY.create({ contextLabel: "bench" });

interface BenchResult {
    format: string;
    writeTime: string;
    readTime: string;
    fileSize: string;
}

const results: BenchResult[] = [];

async function runBenchmark(
    formatName: string,
    dbPath: string,
    columnType: "TEXT" | "BLOB",
    serialize: (res: any) => any,
) {
    try {
        await Deno.remove(dbPath);
    } catch {
        /* ignore */
    }
    const db = new DB(dbPath);

    db.execute("PRAGMA journal_mode = WAL;");
    db.execute("PRAGMA synchronous = OFF;");
    db.execute("PRAGMA temp_store = MEMORY;");
    db.execute(
        `CREATE TABLE audit_bench (id INTEGER PRIMARY KEY AUTOINCREMENT, data ${columnType})`,
    );

    const query = db.prepareQuery("INSERT INTO audit_bench (data) VALUES (?)");

    // FASE 1: ESCRITA
    const startWrite = performance.now();
    db.execute("BEGIN TRANSACTION");

    // Usando uma sessão de cache para ser justo com a engine em cálculos repetitivos
    {
        using _cache = CalcAUYLogic.createCacheSession();
        for (let i = 0; i < TOTAL_ITEMS; i++) {
            const periods = i % 120;
            // M = P * (1 + i)^n
            const res = await Engine.from("1000")
                .mult(Engine.from("1.01").pow(periods))
                .commit();

            query.execute([serialize(res)]);
        }
    }

    db.execute("COMMIT");
    const endWrite = performance.now();
    query.finalize();

    const fileSize = (await Deno.stat(dbPath)).size;

    // FASE 2: LEITURA
    const startRead = performance.now();
    const rows = db.query("SELECT data FROM audit_bench");
    let count = 0;
    for (const [data] of rows) {
        if (data) count++;
    }
    const endRead = performance.now();

    db.close();

    results.push({
        format: formatName,
        writeTime: ((endWrite - startWrite) / 1000).toFixed(3) + "s",
        readTime: ((endRead - startRead) / 1000).toFixed(3) + "s",
        fileSize: (fileSize / (1024 * 1024)).toFixed(2) + " MB",
    });

    assertEquals(count, TOTAL_ITEMS);
    try {
        await Deno.remove(dbPath);
    } catch {
        /* ignore */
    }
}

describe("Benchmark: CalcAUY Storage Efficiency (SQLite3) - Isolated Packages", () => {
    it(`deve comparar 4 formatos com ${TOTAL_ITEMS.toLocaleString()} registros`, async () => {
        // 1. JSON (toAuditTrace)
        await runBenchmark(
            "JSON (TEXT)",
            "tests/bench_json.db",
            "TEXT",
            (res) => res.toAuditTrace(),
        );

        // 2. CBOR (toCustomOutput)
        await runBenchmark(
            "CBOR (BLOB)",
            "tests/bench_cbor.db",
            "BLOB",
            (res) => res.toCustomOutput(cborProcessor),
        );

        // 3. MessagePack (toCustomOutput)
        await runBenchmark(
            "MsgPack (BLOB)",
            "tests/bench_msgpack.db",
            "BLOB",
            (res) => res.toCustomOutput(msgpackProcessor),
        );

        // 4. Protobuf (toCustomOutput)
        await runBenchmark(
            "Protobuf (BLOB)",
            "tests/bench_proto.db",
            "BLOB",
            (res) => res.toCustomOutput(protobufProcessor),
        );

        console.table(results);
    });
});
