// Função para carregar exemplos via API
async function loadExamples() {
    const grid = document.getElementById("grid");
    if (!grid) return;

    try {
        const response = await fetch("/api/examples");
        if (!response.ok) throw new Error("Falha ao carregar exemplos do servidor.");
        const examples = await response.json();

        grid.innerHTML = ""; // Limpa o estado de carregamento

        examples.forEach((ex) => {
            const article = document.createElement("article");
            article.className = "card";

            // Construção do HTML com template literals corrigidos para evitar indentação indesejada
            article.innerHTML = `
        <h3 style="color: var(--primary);">${ex.title}</h3>
        <p><strong>Cenário:</strong> ${ex.params}</p>
        
        <div class="card-code" aria-label="Código fonte executado">
<code>${ex.source || "// Código não disponível"}</code>
        </div>

        <div class="card-math" aria-label="Expressão matemática visualizada: ${ex.verbal}">
        </div>

        <p style="font-size: 1.5rem; margin-top: auto;">
          <strong>Total: R$ ${ex.result}</strong>
        </p>
      `;
            grid.appendChild(article);

            // Renderização KaTeX
            const mathContainer = article.querySelector(".card-math");
            if (mathContainer && ex.latex) {
                katex.render(ex.latex.replace(/\$\$/g, ""), mathContainer, {
                    throwOnError: false,
                    displayMode: true,
                });
            }
        });
    } catch (err) {
        grid.innerHTML = `<p class="error" role="alert">Erro: ${err.message}</p>`;
    }
}

// Lógica do formulário interativo (Simulador)
const simulationForm = document.getElementById("f");
if (simulationForm) {
    simulationForm.onsubmit = async (e) => {
        e.preventDefault();
        const resTxt = document.getElementById("res-txt");
        const resMath = document.getElementById("res-math");
        const resBox = document.getElementById("res-box");

        if (!resTxt || !resMath) return;

        resTxt.textContent = "Processando cálculo financeiro auditável...";
        resMath.innerHTML = "";
        resBox.setAttribute("aria-busy", "true");

        const payload = {
            principal: document.getElementById("p").value,
            rate: document.getElementById("r").value,
            time: document.getElementById("t").value,
        };

        try {
            const response = await fetch("/api/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Erro no cálculo do servidor.");
            const data = await response.json();

            // Atualiza o texto verbal para leitores de tela
            resTxt.textContent = data.verbal;
            resBox.setAttribute("aria-busy", "false");

            // Renderiza o LaTeX
            katex.render(data.latex.replace(/\$\$/g, ""), resMath, {
                throwOnError: false,
                displayMode: true,
            });
        } catch (err) {
            resTxt.textContent = "Erro: " + err.message;
            resBox.setAttribute("aria-busy", "false");
        }
    };
}

// Inicialização segura
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadExamples);
} else {
    loadExamples();
}
