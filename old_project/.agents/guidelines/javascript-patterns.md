# Padrões JavaScript Acessíveis

## 1. Modais (Dialogs)
Um modal deve capturar o foco e impedir interação com o fundo.

### Requisitos:
1. Ao abrir, o foco vai para o primeiro elemento interativo ou título.
2. `Tab` circula apenas dentro do modal ("Focus Trap").
3. `Esc` fecha o modal.
4. Ao fechar, o foco volta para o botão que abriu o modal.
5. `aria-modal="true"` e `role="dialog"`.

```javascript
const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');

openBtn.addEventListener('click', () => {
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  closeBtn.focus(); // Captura foco
});

closeBtn.addEventListener('click', () => {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  openBtn.focus(); // Retorna foco
});
```

## 2. Acordeões (Accordions)
Use `button` para cabeçalhos e controle de estado `aria-expanded`.

```javascript
const accordionBtns = document.querySelectorAll('.accordion-trigger');

accordionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isExpanded);
    
    const contentId = btn.getAttribute('aria-controls');
    document.getElementById(contentId).hidden = isExpanded;
  });
});
```

## 3. Alertas Dinâmicos (Live Regions)
Para anunciar mensagens sem mover o foco (ex: "Salvo com sucesso").

```html
<div id="alert-box" role="alert" aria-live="polite"></div>
```

```javascript
function showAlert(message) {
  const alertBox = document.getElementById('alert-box');
  alertBox.textContent = message; // Leitor de tela anuncia automaticamente
  
  setTimeout(() => { alertBox.textContent = ''; }, 3000);
}
```
