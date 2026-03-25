// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Utilitário para atualizar a seção interativa
function updateInteractiveDisplay(data) {
    const container = document.getElementById("interactive-outputs");
    if (!container) { return; }

    const mapping = {
        toString: data.toString,
        toFloatNumber: data.toFloatNumber,
        toRawInternalBigInt: data.toRawInternalBigInt,
        toMonetary: data.toMonetary,
        toLaTeX: data.toLaTeX,
        toUnicode: data.toUnicode,
        toVerbalA11y: data.toVerbalA11y,
        toCustomOutput: data.toCustomOutput,
        // toHTML handled separately below
        toJson: (function() {
            if (!data.toJson) return '';
            try {
                const parsed = typeof data.toJson === 'string' ? JSON.parse(data.toJson) : data.toJson;
                return `<div class="json-view">${JSON.stringify(parsed, null, 2)}</div>`;
            } catch (e) {
                console.error("Erro no JSON interativo:", e);
                return `<div class="json-view error">Erro no formato JSON</div>`;
            }
        })(),
        toImageBuffer: `
      <div class="image-output-wrapper">
        <div class="binary-view">${data.toImageBufferHex}</div>
        <img src="${data.toImageDataBase64}" alt="Renderização visual do resultado" class="image-result">
      </div>
    `,
    };

    for (const [key, val] of Object.entries(mapping)) {
        const item = container.querySelector(`[data-type="${key}"]`);
        if (item) {
            const valEl = item.querySelector(".val, .val-math, .img-preview");
            if (valEl) { valEl.innerHTML = val; }
        }
    }

    // Atualiza o div de output com o HTML (seguro, pois vem do nosso gerador que já sanitiza/estiliza)
    const htmlOutput = document.getElementById("html-output");
    if (htmlOutput && data.toHTML) {
        htmlOutput.innerHTML = data.toHTML;
    }
}

const methodTitles = {
    verbalMonetary: "1. locale",
    currencyOptions: "1.1 Currency Options",
    roundingShowcase: "2. Rounding",
    strategyShowcase: "2.1 Strategies (Div/Mod)",
    toString: "3. toString",
    toFloatNumber: "4. toFloatNumber",
    toRawInternalBigInt: "5. toRawInternalBigInt",
    toMonetary: "6. toMonetary",
    toLaTeX: "7. toLaTeX",
    toHTML: "8. toHTML",
    toUnicode: "9. toUnicode",
    toVerbalA11y: "10. toVerbalA11y",
    toCustomOutput: "10.1 toCustomOutput",
    toImageBuffer: "11. toImageBuffer",
    toJson: "12. toJson",
    add: "Adição",
    sub: "Subtração",
    mult: "Multiplicação",
    div: "Divisão",
    pow: "Potência",
    mod: "Módulo",
    divInt: "Divisão Inteira",
    group: "Agrupamento",
};

function renderCategory(method, examples, groupType, container) {
    const section = document.createElement("section");
    section.id = `sec-${method}`;
    section.innerHTML = `<h2>${methodTitles[method] || method}</h2>`;

    const grid = document.createElement("div");
    grid.className = "grid";

    examples.forEach((ex) => {
        const article = document.createElement("article");
        article.className = "card";

        let resultView = "";
        if (groupType === "operations") {
            resultView = `
                        <div class="result-label">toString():</div>
                        <div class="card-result-text">${ex.outputs.toString}</div>
                        <div class="result-label" style="margin-top: 10px;">toMonetary():</div>
                        <div class="card-result-text">${ex.outputs.toMonetary}</div>
                        <div class="result-label" style="margin-top: 10px;">toHTML():</div>
                        <div class="card-math-render">${ex.outputs.toHTML}</div>
                    `;
        } else if (method === "toCustomOutput") {
            resultView =
                `<div class="card-result-text" style="font-family: monospace; font-size: 0.85em; background: #eee; padding: 10px; border-radius: 4px; color: #555;">${ex.outputs.toCustomOutput}</div>`;
        } else if (method === "toImageBuffer") {
            resultView = `
                        <div class="image-output-wrapper">
                          <div class="binary-view-small">${ex.outputs.toImageBufferHex}</div>
                          <img src="${ex.outputs.toImageDataBase64}" alt="Image Result" class="image-result">
                        </div>
                    `;
        } else if (method === "toHTML") {
            resultView = `<div class="card-math-render">${ex.outputs.toHTML}</div>
                                  <div class="result-label">Resultado numérico:</div>
                                  <div class="card-result-text">${ex.outputs.toString}</div>`;
        } else if (method === "toJson") {
            try {
                const jsonValue = ex.outputs.toJson;
                const parsed = typeof jsonValue === 'string' ? JSON.parse(jsonValue) : jsonValue;
                resultView = `<div class="json-view">${JSON.stringify(parsed, null, 2)}</div>`;
            } catch (e) {
                console.error("Erro ao renderizar JSON:", e);
                resultView = `<div class="json-view error">Erro no formato JSON</div>`;
            }
        } else if (method === "verbalMonetary" || method === "currencyOptions") {
            resultView = `
                        <div class="result-label">Monetary:</div>
                        <div class="card-result-text">${ex.outputs.toMonetary}</div>
                        <div class="result-label" style="margin-top: 10px;">Verbal (A11y):</div>
                        <div class="card-result-text" style="font-size: 0.9em; font-style: italic;">${ex.outputs.toVerbalA11y}</div>
                    `;
        } else if (method === "roundingShowcase" || method === "strategyShowcase") {
            resultView = `
                        <div class="card-math-render">${ex.outputs.toHTML}</div>
                        <div class="result-label">LaTeX Source:</div>
                        <div class="card-code" style="font-size: 0.75em;">${ex.outputs.toLaTeX}</div>
                        <div class="result-label" style="margin-top: 5px;">Result:</div>
                        <div class="card-result-text">${ex.outputs.toString}</div>
                    `;
        } else {
            resultView = `<div class="card-result-text">${ex.outputs[method]}</div>`;
        }

        article.innerHTML = `
                  <h3>${ex.title}</h3>
                  <p class="context"><strong>Contexto:</strong> ${ex.context}</p>
                  <div class="card-code"><code>${ex.code}</code></div>
                  <div class="result-label">Resultado:</div>
                  <div class="result-area">${resultView}</div>
                `;
        grid.appendChild(article);
    });

    section.appendChild(grid);
    container.appendChild(section);
}

// Carregar e categorizar exemplos
async function loadExamples() {
    const container = document.getElementById("categories-container");
    if (!container) { return; }

    try {
        const response = await fetch("/api/examples");
        const categoriesGrouped = await response.json();
        container.innerHTML = "";

        // 1. Renderiza Grupo OPERAÇÕES
        const operationsHeader = document.createElement("h1");
        operationsHeader.className = "group-main-header";
        operationsHeader.textContent = "Operações";
        container.appendChild(operationsHeader);

        for (const [method, examples] of Object.entries(categoriesGrouped.operations)) {
            renderCategory(method, examples, "operations", container);
        }

        // 2. Renderiza Grupo OUTPUTS
        const outputHeader = document.createElement("h1");
        outputHeader.className = "group-main-header";
        outputHeader.textContent = "Outputs";
        container.appendChild(outputHeader);

        for (const [method, examples] of Object.entries(categoriesGrouped.outputs)) {
            renderCategory(method, examples, "outputs", container);
        }
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="error">Erro ao carregar exemplos: ${err.message}</p>`;
    }
}

// Global resolve for code request
let codePromiseResolve = null;

// Inicialização
function init() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute("data-theme") || "light";

    const darkModeBtn = document.getElementById("modo-escuro");
    if (darkModeBtn) {
        const isDark = currentTheme === "dark";
        darkModeBtn.setAttribute("aria-pressed", isDark);
        darkModeBtn.querySelector("span").textContent = isDark ? "☾" : "☼";
    }

    // Sincroniza estado de alto contraste se aplicado pelo head
    const contrastBtn = document.getElementById("alto-contraste");
    if (contrastBtn) {
        const isContrast = htmlEl.classList.contains("alto-contraste-init")
            || document.body.classList.contains("alto-contraste");

        if (isContrast) {
            document.body.classList.add("alto-contraste");
            contrastBtn.setAttribute("aria-pressed", "true");
        }
        // Limpa a classe temporária do head
        htmlEl.classList.remove("alto-contraste-init");
    }

    // Carregar Exemplos
    loadExamples();

    // Listener para mensagens do Editor Sandbox
    globalThis.addEventListener("message", (event) => {
        if (event.data.type === "CODE_RESPONSE") {
            if (codePromiseResolve) {
                codePromiseResolve(event.data.code);
                codePromiseResolve = null;
            }
        } else if (event.data.type === "CODE_ERROR") {
            if (codePromiseResolve) {
                alert(event.data.error);
                codePromiseResolve(null);
                codePromiseResolve = null;
            }
        } else if (event.data.type === "EDITOR_READY") {
            // Sincroniza o tema quando o editor estiver pronto
            const iframe = document.getElementById("editor-iframe");
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                    { type: "THEME_CHANGE", theme: htmlEl.getAttribute("data-theme") },
                    "*",
                );
            }
        }
    });

    const btnExecutar = document.getElementById("btn-executar");
    if (btnExecutar) {
        btnExecutar.addEventListener("click", async () => {
            const originalText = btnExecutar.textContent;
            const iframe = document.getElementById("editor-iframe");

            if (!iframe || !iframe.contentWindow) { return; }

            // Solicita o código ao editor via postMessage
            const expression = await new Promise((resolve) => {
                codePromiseResolve = resolve;
                iframe.contentWindow.postMessage({ type: "GET_CODE" }, "*");
                // Timeout de segurança
                setTimeout(() => {
                    if (codePromiseResolve === resolve) {
                        codePromiseResolve(null);
                        codePromiseResolve = null;
                        alert("O editor não respondeu.");
                    }
                }, 2000);
            });

            if (!expression) { return; }

            btnExecutar.disabled = true;
            btnExecutar.textContent = "Processando...";

            const payload = { expression };

            try {
                const response = await fetch("/api/calculate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "CalcAUD-Demo",
                    },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (data.error) {
                    alert("Erro na expressão: " + data.error);
                } else {
                    updateInteractiveDisplay(data);
                }
            } catch (err) {
                console.error("Erro no cálculo:", err);
                alert("Erro ao conectar com o servidor.");
            } finally {
                btnExecutar.disabled = false;
                btnExecutar.textContent = originalText;
            }
        });
    }

    // Modo Escuro
    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const theme = htmlEl.getAttribute("data-theme");
            const newTheme = theme === "dark" ? "light" : "dark";

            htmlEl.setAttribute("data-theme", newTheme);
            try {
                localStorage.setItem("theme", newTheme);
            } catch (_e) {
                // localStorage might be blocked
            }

            const isDark = newTheme === "dark";
            darkModeBtn.setAttribute("aria-pressed", isDark);
            darkModeBtn.querySelector("span").textContent = isDark ? "☾" : "☼";

            // Notificar o editor sobre a mudança de tema
            const iframe = document.getElementById("editor-iframe");
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: "THEME_CHANGE", theme: newTheme }, "*");
            }
        });
    }

    // Alto Contraste
    if (contrastBtn) {
        contrastBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const isPressed = contrastBtn.getAttribute("aria-pressed") === "true";
            document.body.classList.toggle("alto-contraste");
            contrastBtn.setAttribute("aria-pressed", !isPressed);
            try {
                localStorage.setItem("altoContraste", !isPressed);
            } catch (_e) {
                // localStorage might be blocked
            }
        });
    }
}

// Inicialização segura após carregamento completo
if (document.readyState === "complete") {
    init();
} else {
    globalThis.addEventListener("load", init);
}
