# Implementação eMAG: Barra de Acessibilidade

O eMAG exige uma barra de acessibilidade no topo de todas as páginas.

## HTML Padrão (Sugestão)

```html
<div id="barra-acessibilidade">
  <ul id="atalhos">
    <li><a href="#conteudo" accesskey="1">Ir para o conteúdo [1]</a></li>
    <li><a href="#menu" accesskey="2">Ir para o menu [2]</a></li>
    <li><a href="#busca" accesskey="3">Ir para a busca [3]</a></li>
    <li><a href="#rodape" accesskey="4">Ir para o rodapé [4]</a></li>
  </ul>
  
  <ul id="opcoes-acessibilidade">
    <li><a href="#" id="alto-contraste">Alto Contraste</a></li>
    <li><a href="/acessibilidade">Acessibilidade</a></li>
    <li><a href="#" id="vlibras-trigger">VLibras</a></li>
  </ul>
</div>
```

## CSS Essencial

```css
#barra-acessibilidade {
  background: #333;
  color: #fff;
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
}

#barra-acessibilidade a {
  color: #fff;
  text-decoration: none;
  padding: 5px 10px;
}

#barra-acessibilidade a:focus {
  outline: 2px solid #fff;
  background: #000;
}
```

## JavaScript (Alto Contraste)

```javascript
const contrastBtn = document.getElementById('alto-contraste');
contrastBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.toggle('alto-contraste');
  
  // Persistir escolha (localStorage)
  const isContrast = document.body.classList.contains('alto-contraste');
  localStorage.setItem('altoContraste', isContrast);
});

// Ao carregar
if (localStorage.getItem('altoContraste') === 'true') {
  document.body.classList.add('alto-contraste');
}
```

## VLibras (Widget)

Adicione antes do fechamento do `</body>`:

```html
<div vw class="enabled">
  <div vw-access-button class="active"></div>
  <div vw-plugin-wrapper>
    <div class="vw-plugin-top-wrapper"></div>
  </div>
</div>
<script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
<script>
  new window.VLibras.Widget('https://vlibras.gov.br/app');
</script>
```
