# Diretrizes de Acessibilidade Mobile

A acessibilidade mobile não é apenas "responsividade". Ela envolve interação por toque e comportamento de leitores de tela móveis (VoiceOver no iOS e TalkBack no Android).

## 1. Alvos de Toque (Touch Targets)
Pessoas com tremores ou dificuldades motoras precisam de alvos fáceis de clicar.

- **Tamanho Mínimo:** Pelo menos **44x44 pixels** (WCAG 2.1) ou **48x48 dp** (Android Material Design).
- **Espaçamento:** Garanta que botões não estejam colados uns nos outros para evitar cliques acidentais.

```css
/* Exemplo de botão mobile acessível */
.mobile-button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px; /* Aumenta a área clicável sem necessariamente mudar o visual */
}
```

## 2. Gestos e Atalhos
- **Não dependa apenas de gestos complexos:** Se houver um gesto de "deslizar para excluir", deve haver uma alternativa simples (ex: um botão de excluir).
- **Evite ativação por movimento:** Se o app faz algo ao balançar o celular, deve haver uma opção para desativar isso ou fazer via interface.

## 3. Comportamento de Tela
- **Orientação:** Não bloqueie a tela apenas em `portrait` (vertical) ou `landscape` (horizontal), a menos que seja essencial (ex: um jogo específico). Usuários em cadeiras de rodas costumam fixar tablets em uma única orientação.
- **Não altere o zoom:** NUNCA use `user-scalable=no` na tag viewport.

```html
<!-- Correto -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- ERRADO (Bloqueia o zoom do usuário) -->
<meta name="viewport" content="width=device-width, user-scalable=no">
```

## 4. Leitores de Tela Mobile
- **Ordem de Varredura:** No mobile, o usuário desliza o dedo para navegar. Garanta que a ordem do DOM reflita a ordem visual.
- **Rótulos de Ícones:** Mobile usa muitos ícones. Todos DEVEM ter um rótulo textual.
- **Anúncio de Mudanças:** Use `aria-live` para mudanças de estado, como alertas de erro ou confirmação de envio.
