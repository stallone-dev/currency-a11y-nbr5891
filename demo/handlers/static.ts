// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export async function serveFile(path: string): Promise<Response> {
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
        return new Response(data, {
            headers: {
                "content-type": mimes[ext ?? ""] || "application/octet-stream",
                "cache-control": "no-store, must-revalidate",
                "access-control-allow-origin": "*", // Permite carregamento de fontes no sandbox
            },
        });
    } catch {
        return new Response("Not Found", { status: 404 });
    }
}
