# Diretrizes de Acessibilidade em SPAs (Single Page Applications)

Em uma SPA, o navegador não recarrega fisicamente a página, o que impede que o leitor de tela anuncie a mudança de título e redefina o foco.

## 1. Anunciar Mudanças de Título
Sempre que uma rota mudar, você deve atualizar o `<title>` do documento e anunciá-lo.

```javascript
function onRoutewardChange(newTitle) {
  document.title = `${newTitle} - Meu App Acessível`;
  // Algumas ferramentas usam um "announcer" invisível
  const announcer = document.getElementById('route-announcer');
  announcer.textContent = `Página carregada: ${newTitle}`;
}
```

```html
<!-- No seu index.html -->
<div id="route-announcer" class="sr-only" aria-live="assertive" aria-atomic="true"></div>
```

## 2. Gerenciamento de Foco em Navegação
Ao navegar para uma nova página:
- Se houver uma barra de navegação persistente, o foco DEVE ser movido para o topo da nova página (H1 ou container de conteúdo).
- NUNCA deixe o foco "sumir" da árvore de acessibilidade.

```javascript
router.afterEach((to, from) => {
  // Pequeno timeout para garantir que o DOM renderizou
  setTimeout(() => {
    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
      mainHeading.setAttribute('tabindex', '-1'); // Permite foco programático em não-focáveis
      mainHeading.focus();
    }
  }, 100);
});
```

## 3. Carregamento de Dados (Skeletons/Spinners)
Se uma parte da página carregar dinamicamente, informe o usuário.

```html
<div aria-live="polite" aria-busy="true">
  <!-- Spinner ou Skeleton aqui -->
  <span class="sr-only">Carregando conteúdo...</span>
</div>
```
Quando o carregamento terminar, mude `aria-busy` para `false`.
