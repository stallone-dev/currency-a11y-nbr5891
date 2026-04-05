# CalcAUD: Internacionalização (I18n) e Acessibilidade (A11y)

**Arquivos de Origem:** `src/output_helpers/i18n.ts`, `src/output_helpers/verbal_translator.ts`

## 1. Filosofia: "Math is Universal, Explanations are Local"

Enquanto a matemática é universal, a forma como descrevemos operações varia drasticamente entre culturas. A `CalcAUD` trata a descrição verbal como um cidadão de primeira classe, não um "pós-processamento".

## 2. Sistema de Tokens (`VERBAL_TOKENS`)

Durante o cálculo, a biblioteca não armazena strings como "mais" ou "plus". Ela armazena **Tokens Semânticos**:

- `{#ADD#}`: Adição
- `{#SUB#}`: Subtração
- `{#GRP_S#}`: Início de Agrupamento (Parêntese)
- `{#DIE_M#}`: Divisão Inteira Euclidiana (Infixo)

Isso permite que a mesma expressão matemática seja traduzida para múltiplos idiomas instantaneamente no momento do output.

## 3. Idiomas Suportados (`LOCALE_CURRENCY_MAP`)

Atualmente suportamos nativamente:

- `pt-BR`: Português Brasileiro (Moeda Padrão: BRL)
- `en-US`: Inglês Americano (Moeda Padrão: USD)
- `en-EU`: Inglês Europeu (Moeda Padrão: EUR)
- `es-ES`: Espanhol (Moeda Padrão: EUR)
- `fr-FR`: Francês (Moeda Padrão: EUR)
- `zh-CN`: Chinês Simplificado (Moeda Padrão: CNY)
- `ru-RU`: Russo (Moeda Padrão: RUB)
- `ja-JP`: Japonês (Moeda Padrão: JPY)

## 4. Acessibilidade (Leitores de Tela)

O método `toVerbalA11y()` gera frases otimizadas para fluidez em TTS (Text-to-Speech).

- **Substituição de Símbolos:** O ponto `.` é lido como "ponto" ou "vírgula" dependendo do locale, evitando que o leitor diga "um ponto zero cinco".
- **Contexto de Agrupamento:** Tokens `{#GRP_S#}` e `{#GRP_E#}` são traduzidos para "em grupo" e "fim do grupo", permitindo que usuários cegos entendam a precedência da operação auditivamente.

## 5. Extensibilidade

Novos idiomas podem ser adicionados simplesmente expandindo o objeto `VERBAL_TRANSLATIONS` em `i18n.ts`, sem necessidade de alterar a lógica de cálculo.
