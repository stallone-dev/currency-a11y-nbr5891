
import { manualExamples } from "./manual-examples.ts";
import { KATEX_CSS_MINIFIED } from "../../processor/html/vendor.ts";
import { encodeBase64 } from "@std/encoding/base64";
import { join, dirname, fromFileUrl } from "@std/path";

const __dirname = dirname(fromFileUrl(import.meta.url));
const OUTPUT_FILE = join(__dirname, "..", "..", "demo", "data", "precalculated_examples.json");

async function generate() {
    console.log("🛠️  Compilando Showcase de Auditoria...");

    const finalData: any = {
        common_css: KATEX_CSS_MINIFIED + ".calc-auy-result { display: inline-block; margin: 0.5em 0; overflow-x: auto; }",
        operations: {},
        audit: {},
        outputs: {}
    };

    for (const ex of manualExamples) {
        console.log(`Processing: [${ex.group}] ${ex.key} - ${ex.title}...`);
        
        let processedResult = ex.result;

        // 1. Tratar Image Buffer (Uint8Array)
        if (processedResult instanceof Uint8Array) {
            processedResult = `data:image/svg+xml;base64,${encodeBase64(processedResult)}`;
        } 
        // 2. Tratar HTML do KaTeX
        else if (typeof processedResult === "string" && processedResult.includes("calc-auy-result")) {
            processedResult = processedResult.replace(/<style>.*?<\/style>/, "");
        }
        // 3. Tratar Objetos/Arrays (formatar para string se não for HTML)
        else if (typeof processedResult === "object" && processedResult !== null) {
            processedResult = JSON.stringify(processedResult, (_key, value) => 
                typeof value === 'bigint' ? value.toString() : value, 2);
        }

        const exampleEntry = {
            title: ex.title,
            context: ex.context,
            code: ex.code,
            result: processedResult,
            customProcessor: ex.customProcessor
        };

        const targetGroup = finalData[ex.group];
        if (!targetGroup[ex.key]) {
            targetGroup[ex.key] = [];
        }
        targetGroup[ex.key].push(exampleEntry);
    }

    await Deno.writeTextFile(OUTPUT_FILE, JSON.stringify(finalData, (_key, value) => 
        typeof value === 'bigint' ? value.toString() : value, 2));
    console.log(`\n🎉 Showcase gerado com sucesso em: ${OUTPUT_FILE}`);
}

if (import.meta.main) {
    generate().catch(console.error);
}
