# Diretrizes de ARIA (WAI-ARIA)

## Regra de Ouro
**Não use ARIA.**
Sempre que possível, use elementos HTML nativos.

- Use `<button>` em vez de `<div role="button">`.
- Use `<nav>` em vez de `<div role="navigation">`.
- Use `<label>` em vez de `<span aria-labelledby="...">`.

## Quando usar ARIA
Use ARIA **apenas** quando:
1. O elemento HTML nativo não tem o suporte desejado.
2. Você está criando um widget complexo (ex: TreeView, Tabs, Carousel) que não existe nativamente.
3. Você precisa fornecer informações extras para leitores de tela (ex: estado, erros, rótulos invisíveis).

## Estados e Propriedades Comuns

### 1. `aria-label` vs `aria-labelledby` vs `aria-describedby`
- `aria-label`: Define um rótulo textual direto. Use quando não há texto visível.
  - `<button aria-label="Fechar">X</button>`
- `aria-labelledby`: Aponta para o ID de outro elemento que serve como rótulo.
  - `<h2 id="titulo-modal">Termos de Uso</h2> ... <div role="dialog" aria-labelledby="titulo-modal">`
- `aria-describedby`: Aponta para uma descrição mais longa ou instruções adicionais.
  - `<input aria-describedby="dica-senha"> <span id="dica-senha">Mínimo 8 caracteres.</span>`

### 2. Estados Dinâmicos
Atualize estes atributos via JavaScript para refletir o estado atual.

- `aria-expanded="true/false"`: Para menus sanfona, dropdowns.
- `aria-hidden="true/false"`: Para esconder elementos da árvore de acessibilidade (mas mantê-los visíveis visualmente, cuidado!).
- `aria-invalid="true/false"`: Para campos de formulário com erro.
- `aria-live="polite/assertive"`: Para anunciar mudanças dinâmicas na página (ex: "Item adicionado ao carrinho").
  - `polite`: Espera o usuário terminar a tarefa atual.
  - `assertive`: Interrompe o usuário imediatamente (use com cautela!).

## Padrões de Widgets

### Abas (Tabs)
```html
<div role="tablist" aria-label="Categorias de Entretenimento">
  <button role="tab" aria-selected="true" aria-controls="painel-1" id="tab-1">Filmes</button>
  <button role="tab" aria-selected="false" aria-controls="painel-2" id="tab-2">Séries</button>
</div>

<div role="tabpanel" id="painel-1" aria-labelledby="tab-1">
  <p>Conteúdo sobre filmes...</p>
</div>
<div role="tabpanel" id="painel-2" aria-labelledby="tab-2" hidden>
  <p>Conteúdo sobre séries...</p>
</div>
```
