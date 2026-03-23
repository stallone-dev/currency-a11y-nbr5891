# Diretrizes de Visualização de Dados e SVGs

## 1. Gráficos Acessíveis
Gráficos DEVEM ter uma representação alternativa em texto ou tabela.

### Regras para Gráficos (Ex: Highcharts, Chart.js, D3):
- **Tabela Equivalente:** Forneça os mesmos dados em uma tabela oculta (`sr-only`) ou link para uma tabela.
- **Não use apenas cores:** Se um gráfico de barras usa cores, ele deve usar também padrões (hachuras) para diferenciar.
- **Rótulos Legíveis:** Garanta contraste nos rótulos e eixos.

## 2. SVGs Acessíveis
Nunca use `<img src="logo.svg">` sem `alt`. Se o SVG estiver "inline" (tag `<svg>`), siga este padrão:

### SVG Informativo (ex: Ícone com significado)
```html
<svg role="img" aria-labelledby="svg-title svg-desc">
  <title id="svg-title">Gráfico de Vendas</title>
  <desc id="svg-desc">Gráfico de barras mostrando aumento de 10% nas vendas em Maio.</desc>
  <!-- paths aqui -->
</svg>
```

### SVG Decorativo
```html
<svg aria-hidden="true" focusable="false">
  <!-- paths aqui -->
</svg>
```

## 3. Tabelas Complexas
Se a tabela tem cabeçalhos em múltiplos níveis, use `scope`, `id` e `headers`.

```html
<table>
  <thead>
    <tr>
      <th rowspan="2" id="vendedor">Vendedor</th>
      <th colspan="2" id="vendas">Vendas por Semestre</th>
    </tr>
    <tr>
      <th id="sem1" headers="vendas">1º Semestre</th>
      <th id="sem2" headers="vendas">2º Semestre</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="joao" headers="vendedor">João</th>
      <td headers="vendas sem1 joao">R$ 500,00</td>
      <td headers="vendas sem2 joao">R$ 700,00</td>
    </tr>
  </tbody>
</table>
```
