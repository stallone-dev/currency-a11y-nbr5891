# Diretrizes de Redação e Experiência do Usuário (UX)

## 1. Linguagem Simples (Plain Language)
Essencial para pessoas com deficiência intelectual, baixa escolaridade ou neurodiversidade.

- Use frases curtas (máximo 20 palavras).
- Evite jargões técnicos sem explicação.
- Use a voz ativa ("O sistema salvou os dados" em vez de "Os dados foram salvos pelo sistema").

## 2. Textos de Link Descritivos
NUNCA use "Clique aqui", "Leia mais", "Veja".
Um leitor de tela pode listar apenas os links da página; o contexto deve estar no próprio link.

```html
<!-- Ruim -->
<p>Para ler o relatório, <a href="relatorio.pdf">clique aqui</a>.</p>

<!-- Bom -->
<p><a href="relatorio.pdf">Leia o Relatório de Gastos de 2024 (PDF, 2MB)</a>.</p>
```

## 3. Mensagens de Erro e Instruções
Instruções devem ser claras e erros devem ser acionáveis.

- **Instruções:** Se um campo tem formato específico, diga no `label` ou `aria-describedby`.
- **Erros:** "O campo Nome é obrigatório" é melhor que "Erro no formulário".

```html
<label for="senha">Senha:</label>
<input id="senha" aria-describedby="instrucao-senha">
<p id="instrucao-senha">Mínimo 8 caracteres, uma letra maiúscula e um número.</p>
```

## 4. Títulos de Página (`<title>`)
Devem ser únicos e específicos.
O padrão recomendado é: `[Nome da Seção] - [Nome do Site]`.
Ex: `Acessibilidade em Governo Eletrônico - Portal eMAG`.

## 5. Tempo de Leitura e Sessão
Se houver limite de tempo:
- Avise o usuário antes de expirar.
- Permita estender o tempo (WCAG 2.2.1).
- Avise se o sistema fizer logout automático por inatividade.
