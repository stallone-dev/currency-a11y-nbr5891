// Utilitário para atualizar a seção interativa
function updateInteractiveDisplay(data) {
    const container = document.getElementById("interactive-outputs");
    if (!container) { return; }

    const mapping = {
        toString: data.toString,
        toFloatNumber: data.toFloatNumber,
        toBigInt: data.toBigInt,
        toMonetary: data.toMonetary,
        toLaTeX: data.toLaTeX,
        toUnicode: data.toUnicode,
        toVerbalA11y: data.toVerbalA11y,
        toHTML: data.toHTML,
        toJson: `<div class="json-view">${JSON.stringify(JSON.parse(data.toJson), null, 2)}</div>`,
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
}

// Carregar e categorizar exemplos
async function loadExamples() {
    const container = document.getElementById("categories-container");
    if (!container) { return; }

    try {
        const response = await fetch("/api/examples");
        const categoriesGrouped = await response.json();
        container.innerHTML = "";

        const methodTitles = {
            verbalMonetary: "1. locale",
            roundingShowcase: "2. Rounding",
            toString: "3. toString",
            toFloatNumber: "4. toFloatNumber",
            toBigInt: "5. toBigInt",
            toMonetary: "6. toMonetary",
            toLaTeX: "7. toLaTeX",
            toHTML: "8. toHTML",
            toUnicode: "9. toUnicode",
            toVerbalA11y: "10. toVerbalA11y",
            toImageBuffer: "11. toImageBuffer",
            toJson: "12. toJson",
            add: "Adição",
            sub: "Subtração",
            mult: "Multiplicação",
            pow: "Potência",
            mod: "Módulo",
            divInt: "Divisão Inteira",
            group: "Agrupamento",
        };

        // 1. Renderiza Grupo OUTPUTS
        const outputHeader = document.createElement("h1");
        outputHeader.className = "group-main-header";
        outputHeader.textContent = "Outputs";
        container.appendChild(outputHeader);

        for (const [method, examples] of Object.entries(categoriesGrouped.outputs)) {
            renderCategory(method, examples, "outputs");
        }

        // 2. Renderiza Grupo OPERAÇÕES
        const operationsHeader = document.createElement("h1");
        operationsHeader.className = "group-main-header";
        operationsHeader.textContent = "Operações";
        container.appendChild(operationsHeader);

        for (const [method, examples] of Object.entries(categoriesGrouped.operations)) {
            renderCategory(method, examples, "operations");
        }

        function renderCategory(method, examples, groupType) {
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
                        <div class="card-result-text" style="color: #000;">${ex.outputs.toString}</div>
                        <div class="result-label" style="margin-top: 10px;">toMonetary():</div>
                        <div class="card-result-text" style="color: var(--primary);">${ex.outputs.toMonetary}</div>
                        <div class="result-label" style="margin-top: 10px;">toHTML():</div>
                        <div class="card-math-render">${ex.outputs.toHTML}</div>
                    `;
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
                    resultView = `<div class="json-view">${
                        JSON.stringify(JSON.parse(ex.outputs.toJson), null, 2)
                    }</div>`;
                } else if (method === "verbalMonetary") {
                    resultView = `
                        <div class="result-label">Monetary:</div>
                        <div class="card-result-text">${ex.outputs.toMonetary}</div>
                        <div class="result-label" style="margin-top: 10px;">Verbal (A11y):</div>
                        <div class="card-result-text" style="font-size: 0.9em; font-style: italic;">${ex.outputs.toVerbalA11y}</div>
                    `;
                } else if (method === "roundingShowcase") {
                    resultView = `
                        <div class="card-math-render">${ex.outputs.toHTML}</div>
                        <div class="result-label">LaTeX Source:</div>
                        <div class="card-code" style="font-size: 0.75em;">${ex.outputs.toLaTeX}</div>
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
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="error">Erro ao carregar exemplos: ${err.message}</p>`;
    }
}

// Formulário de simulação
const simulationForm = document.getElementById("f");
if (simulationForm) {
    simulationForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = simulationForm.querySelector("button");
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Processando...";

        const payload = {
            expression: document.getElementById("expr").value,
        };

        try {
            const response = await fetch("/api/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            btn.disabled = false;
            btn.textContent = originalText;
        }
    };
}

document.addEventListener("DOMContentLoaded", loadExamples);
