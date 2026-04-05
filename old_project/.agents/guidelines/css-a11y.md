# Diretrizes de CSS para Acessibilidade

## 1. Foco Visível (`:focus`)
Nunca remova o indicador de foco padrão (`outline: none`) sem fornecer um substituto visível de alto contraste.

```css
/* Errado */
*:focus { outline: none; }

/* Correto */
*:focus-visible {
  outline: 2px solid #000;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px #fff; /* Duplo anel para contraste em fundos claros/escuros */
}
```

## 2. Unidades Relativas
Use `rem` ou `em` para tamanhos de fonte e espaçamentos, permitindo que o usuário redimensione o texto sem quebrar o layout.

```css
/* Errado */
body { font-size: 16px; }
.card { width: 300px; }

/* Correto */
html { font-size: 100%; } /* Respeita configuração do navegador */
body { font-size: 1rem; }
.card { max-width: 20rem; }
```

## 3. Contraste de Cores
Certifique-se de que a relação de contraste entre texto e fundo atenda aos critérios WCAG AA (4.5:1 para texto normal, 3:1 para texto grande).

Ferramentas sugeridas:
- WebAIM Contrast Checker
- DevTools do navegador (Inspecionar Elemento > Acessibilidade)

## 4. Ocultação de Conteúdo

### Ocultar visualmente, mas manter para leitores de tela
Use esta classe para rótulos de ícones ou instruções adicionais.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Ocultar completamente (Visual + Leitor de Tela)
Use `display: none` ou `visibility: hidden`.
- `display: none`: Remove do fluxo da página.
- `visibility: hidden`: Mantém espaço, mas invisível.

## 5. Media Queries de Preferência do Usuário

### Movimento Reduzido (`prefers-reduced-motion`)
Respeite usuários que preferem menos animações para evitar enjoo ou distração.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Modo Escuro (`prefers-color-scheme`)
```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: #121212;
    color: #e0e0e0;
  }
}
```
