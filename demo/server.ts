import { AuditableAmount } from "../mod.ts";
import { dirname, fromFileUrl, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const ROOT = dirname(__dirname);

const getExamples = () =>
    [
        {
            title: "Baskhara (Raiz Positiva)",
            params: "a=1, b=-5, c=6",
            source:
                "const delta = b.pow(2).sub(AuditableAmount.from(4).mult(a).mult(c)).group();\nconst x1 = b.mult(-1).add(delta.pow('1/2')).group().div(a.mult(2).group());",
            calc: (() => {
                const a = AuditableAmount.from(1);
                const b = AuditableAmount.from(-5);
                const c = AuditableAmount.from(6);
                const delta = b.pow(2).sub(AuditableAmount.from(4).mult(a).mult(c)).group();
                return b.mult(-1).add(delta.pow("1/2")).group().div(a.mult(2).group());
            })(),
        },
        {
            title: "SAC (Parcela N=10)",
            params: "Saldo=200k, n=100, i=0.8%, Pago=9",
            source:
                "const amort = saldo.div(n).group();\nconst juros = saldo.sub(amort.mult(9)).group().mult(0.008).group();\nconst prestacao = amort.add(juros);",
            calc: (() => {
                const saldo = AuditableAmount.from(200000);
                const n = 100;
                const amort = saldo.div(n).group();
                const juros = saldo.sub(amort.mult(9)).group().mult(0.008).group();
                return amort.add(juros);
            })(),
        },
        {
            title: "Margem de Contribuição",
            params: "PV=150, ICMS=18%, PIS/COFINS=9.25%, Custo=80",
            source:
                "const impostos = AuditableAmount.from(0.18).add(0.0925).group();\nconst liq = pv.mult(AuditableAmount.from(1).sub(impostos).group()).group();\nconst margem = liq.sub(80);",
            calc: (() => {
                const pv = AuditableAmount.from(150);
                const impostos = AuditableAmount.from(0.18).add(0.0925).group();
                const liq = pv.mult(AuditableAmount.from(1).sub(impostos).group()).group();
                return liq.sub(80);
            })(),
        },
        {
            title: "Taxa Efetiva (Nominal 12% a.a.)",
            params: "i=12% a.a., cap=mensal (12x)",
            source:
                "const i = AuditableAmount.from(0.12).div(12).group();\nconst efetiva = AuditableAmount.from(1).add(i).group().pow(12).sub(1);",
            calc: (() => {
                const i = AuditableAmount.from(0.12).div(12).group();
                return AuditableAmount.from(1).add(i).group().pow(12).sub(1);
            })(),
        },
        {
            title: "ICMS por Dentro (Reverso)",
            params: "Base=1000, Alíq=18%",
            source: "AuditableAmount.from(1000).div(AuditableAmount.from(1).sub(0.18).group())",
            calc: AuditableAmount.from(1000).div(AuditableAmount.from(1).sub(0.18).group()),
        },
        {
            title: "Arredondamento NBR 5891",
            params: "1.225 (Par) vs 1.235 (Ímpar)",
            source:
                "AuditableAmount.from('1.225').commit(2) // '1.22'\nAuditableAmount.from('1.235').commit(2) // '1.24'",
            calc: AuditableAmount.from("1.235"),
        },
    ].map((ex) => ({
        title: ex.title,
        params: ex.params,
        source: ex.source,
        latex: ex.calc.toLaTeX(ex.title.includes("Arredondamento") ? 2 : 4),
        verbal: ex.calc.toVerbal(ex.title.includes("Arredondamento") ? 2 : 4),
        result: ex.calc.commit(ex.title.includes("Arredondamento") ? 2 : 4),
    }));

async function serveFile(path: string) {
    const ext = path.split(".").pop();
    const mimes: Record<string, string> = {
        html: "text/html; charset=utf-8",
        js: "application/javascript",
        css: "text/css",
        woff: "font/woff",
        woff2: "font/woff2",
        ttf: "font/ttf",
    };
    try {
        const data = await Deno.readFile(path);
        return new Response(data, { headers: { "content-type": mimes[ext!] || "application/octet-stream" } });
    } catch {
        return new Response("Not Found", { status: 404 });
    }
}

Deno.serve({ port: 8000 }, async (req) => {
    const url = new URL(req.url);

    if (url.pathname === "/") return serveFile(join(__dirname, "index.html"));
    if (url.pathname === "/style.css") return serveFile(join(__dirname, "style.css"));
    if (url.pathname === "/script.js") return serveFile(join(__dirname, "script.js"));

    if (url.pathname === "/api/examples") {
        return new Response(JSON.stringify(getExamples()), { headers: { "content-type": "application/json" } });
    }

    if (url.pathname === "/api/calculate") {
        try {
            const { principal, rate, time } = await req.json();
            const res = AuditableAmount.from(principal).mult(AuditableAmount.from(1).add(rate).group().pow(time));
            return new Response(
                JSON.stringify({
                    result: res.commit(2),
                    latex: res.toLaTeX(2),
                    verbal: res.toVerbal(2),
                }),
                { headers: { "content-type": "application/json" } },
            );
        } catch {
            return new Response("Error", { status: 400 });
        }
    }

    if (url.pathname.startsWith("/assets/")) return serveFile(join(ROOT, url.pathname));
    return new Response("Not Found", { status: 404 });
});
