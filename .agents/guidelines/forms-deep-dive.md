# Guia de Formulários Complexos e Acessíveis

Formulários são a principal forma de interação do usuário. Qualquer barreira aqui impede a conclusão da tarefa.

## 1. Agrupamento Semântico (`fieldset` e `legend`)
Sempre que um grupo de campos compartilha o mesmo contexto (ex: Endereço, Pergunta de múltipla escolha), use `fieldset`.

```html
<fieldset>
  <legend>Endereço de Entrega</legend>
  <label for="rua">Rua:</label> <input id="rua">
  <label for="cep">CEP:</label> <input id="cep">
</fieldset>
```

## 2. Mensagens de Erro em Tempo Real
NÃO use apenas cor (vermelho) para erro. Use texto e ícones (`aria-invalid`).

```html
<label for="email">Email:</label>
<input type="email" id="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error" class="error-text">
  <span class="sr-only">Erro:</span> Digite um email válido (ex: nome@exemplo.com)
</p>
```

## 3. Feedback Após Submissão
Se houver múltiplos erros, mova o foco para um **Sumário de Erros** no topo do formulário.

```html
<div id="error-summary" role="alert" aria-labelledby="error-summary-title" tabindex="-1">
  <h2 id="error-summary-title">Há 3 erros neste formulário:</h2>
  <ul>
    <li><a href="#email">Email inválido</a></li>
    <li><a href="#senha">Senha muito curta</a></li>
    <li><a href="#termos">Aceite os termos de uso</a></li>
  </ul>
</div>
```

## 4. Campos Obrigatórios
Indique de forma textual, não apenas com `*`. Use o atributo `required` e `aria-required="true"`.

```html
<label for="nome">Nome Completo <span aria-hidden="true">*</span> <span class="sr-only">(obrigatório)</span></label>
<input id="nome" required aria-required="true">
```

## 5. Dicas e Formatos (Máscaras)
Sempre informe o formato esperado. Se usar máscara (ex: CPF `000.000.000-00`), o leitor de tela deve anunciar apenas os números ou o formato completo.

```html
<label for="data">Data de Nascimento:</label>
<input id="data" placeholder="DD/MM/AAAA" aria-describedby="dica-data">
<p id="dica-data">Use o formato dia, mês e ano completo.</p>
```
