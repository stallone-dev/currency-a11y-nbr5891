# Contexto do Projeto: currency-math-audit

Este projeto é uma biblioteca em Deno (TypeScript) projetada para realizar cálculos financeiros com alta precisão e capacidade de auditoria visual através da geração automática de expressões LaTeX.

## 🏗️ Arquitetura e Tecnologias

- **Runtime:** [Deno](https://deno.land/)
- **Linguagem:** TypeScript
- **Dependências:** `@std/assert` (para testes)
- **Frontend/Aesthetics:** O diretório `assets/` contém uma distribuição completa do **KaTeX**, sugerindo que o projeto visa renderizar as expressões matemáticas geradas em uma interface web.

## 📄 Componentes Principais

### `mod.ts`
Contém a classe principal `AuditableAmount`.
- **Precisão:** Utiliza `bigint` com um `SCALE` de 10^8 para evitar erros de ponto flutuante.
- **Auditoria:** Mantém estados internos (`_totalExpr`, `_termExpr`) que registram a precedência das operações (ex: move termos para o total em adições, usa `\frac` em divisões).
- **LaTeX:** O método `toLaTeX()` exporta a fórmula completa formatada para exibição.
- **⚠️ Observação:** Os métodos `parse` e `format` na classe `AuditableAmount` estão atualmente implementados como placeholders (`return 0n`, `return ""`).

### `mod_test.ts`
- Arquivo de testes unitários.
- **⚠️ Estado Atual:** O teste está **quebrado**. Ele tenta importar uma função `add` que não existe no `mod.ts` (a funcionalidade está encapsulada na classe `AuditableAmount`).

## 🚀 Comandos Úteis

- **Executar Testes:** `deno test`
- **Desenvolvimento (Watch Mode):** `deno task dev` (executa `deno test --watch`)

## 🛠️ Convenções de Desenvolvimento

1.  **Segurança e Precisão:** Sempre utilize `AuditableAmount` para manipulação de valores monetários. Nunca use `number` diretamente para somas ou subtrações financeiras.
2.  **Imutabilidade:** As operações na classe `AuditableAmount` retornam novas instâncias, preservando a imutabilidade dos termos anteriores.
3.  **LaTeX:** Ao adicionar novas operações matemáticas, certifique-se de atualizar os registradores léxicos para manter a rastreabilidade do cálculo.

## 📅 Roadmap / Pendências (Inferidas)
- [ ] Implementar lógica real nos métodos `parse` e `format`.
- [ ] Corrigir `mod_test.ts` para utilizar a API da classe `AuditableAmount`.
- [ ] Integrar os `assets/katex` em uma página de demonstração (ex: `index.html`).
