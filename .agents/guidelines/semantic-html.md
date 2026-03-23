# Diretrizes de HTML Semântico

## 1. Estrutura da Página (Landmarks)
Use as tags semânticas para definir as áreas principais da página. Isso facilita a navegação por leitores de tela.

```html
<body>
  <header>
    <!-- Cabeçalho, logomarca, busca, menu principal -->
    <nav aria-label="Menu Principal">...</nav>
  </header>

  <main id="conteudo-principal">
    <!-- Conteúdo único da página -->
    <h1>Título da Página</h1>
    ...
  </main>

  <aside>
    <!-- Conteúdo relacionado, mas não vital -->
  </aside>

  <footer>
    <!-- Rodapé, links institucionais -->
  </footer>
</body>
```

## 2. Cabeçalhos (Headings)
Mantenha uma hierarquia lógica. Não pule níveis (ex: de H1 para H3).

- `h1`: Título principal da página (apenas um por página).
- `h2`: Seções principais.
- `h3`: Subseções.

## 3. Imagens e Mídia
Todas as imagens devem ter o atributo `alt`.

```html
<!-- Correto: Imagem informativa -->
<img src="grafico-acessos.png" alt="Gráfico de barras mostrando aumento de 20% nos acessos em 2024">

<!-- Correto: Imagem decorativa -->
<img src="separador.png" alt="">

<!-- Incorreto: Sem alt ou alt redundante -->
<img src="foto.jpg"> <!-- Erro -->
<img src="foto.jpg" alt="foto.jpg"> <!-- Erro -->
<img src="foto.jpg" alt="imagem"> <!-- Erro -->
```

## 4. Tabelas
Use tabelas APENAS para dados tabulares. Nunca para layout.

```html
<table>
  <caption>Relatório de Gastos - 2024</caption>
  <thead>
    <tr>
      <th scope="col">Mês</th>
      <th scope="col">Valor (R$)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Janeiro</th> <!-- Célula de cabeçalho da linha -->
      <td>1.500,00</td>
    </tr>
  </tbody>
</table>
```

## 5. Formulários
Associe explicitamente rótulos aos campos.

```html
<!-- Explicito (Melhor) -->
<label for="nome">Nome Completo:</label>
<input type="text" id="nome" name="nome" required>

<!-- Implícito (Aceitável) -->
<label>
  Email:
  <input type="email" name="email">
</label>

<!-- Agrupamento -->
<fieldset>
  <legend>Preferência de Contato</legend>
  <label><input type="radio" name="contato" value="email"> Email</label>
  <label><input type="radio" name="contato" value="tel"> Telefone</label>
</fieldset>
```
