# 22 - Pacote de Processadores Extras (Modulares)

## Motivo
A CalcAUY segue o princípio do **Core Minimalista**. Enquanto o núcleo da biblioteca foca em precisão absoluta e rastro matemático com zero dependências externas, o ecossistema exige formatos de alta performance (binários), visuais (HTML/Imagem) e de persistência (SQL). 

O pacote de processadores extras (disponível em `@processor/*`) permite essas extensões sem inflar o bundle do core ou introduzir dependências pesadas (como `protobufjs` ou `katex`) para todos os usuários. Isso garante que a biblioteca permaneça leve para o front-end enquanto oferece poder total para o back-end e sistemas de auditoria.

## Implementação Técnica
Os processadores extras são implementados de forma desacoplada e consumidos através do método `.toCustomOutput(processor)`.

1.  **Formatos Binários Compactos (CBOR & MessagePack):**
    -   Implementam um mapeamento numérico (`KIND_MAP` / `OP_MAP`) para substituir strings repetitivas (ex: "literal" vira `1`).
    -   Utilizam serialização recursiva para manter a integridade da AST.
2.  **Protobuf v3 (Schema-First):**
    -   Baseado em uma definição `.proto` rigorosa que utiliza `oneof` para representar a natureza polimórfica dos nós da AST.
    -   Garante compatibilidade cross-language e o maior índice de compressão da suíte.
3.  **Renderização Visual e Acessibilidade:**
    -   **HTML Processor:** Utiliza KaTeX para gerar fórmulas matemáticas de alta qualidade, injetando CSS e fontes WOFF2 embutidas para garantir que o rastro seja auto-contido.
    -   **Image (SVG) Processor:** Encapsula a renderização matemática em um container SVG (via `foreignObject`), permitindo o uso do rastro em ambientes que não suportam HTML complexo.
4.  **Mapeamento de Persistência (SQL/Prisma):**
    -   Transforma o rastro vivo em um record denormalizado (`ICalcAUYPersistenceRecord`), facilitando a inserção em bancos de dados relacionais com colunas específicas para assinatura e estratégia de arredondamento.

## Ganho (Benchmarks Reais)
Em testes de estresse com 100.000 cálculos de juros compostos persistidos em SQLite3, os processadores extras apresentaram os seguintes resultados:

-   **Eficiência de Armazenamento:** O formato **Protobuf** reduziu o tamanho do banco de dados em **36%** comparado ao JSON tradicional.
-   **Performance de Leitura:** O acesso a dados binários (BLOB) foi **2x mais rápido** que o parse de strings JSON (TEXT).
-   **Modularidade:** Zero impacto no `mod.ts` principal. O desenvolvedor importa apenas o que utiliza, mantendo o `tree-shaking` eficiente.

## Notas de Engenharia
-   **Rigor de Tipagem:** Para satisfazer os encoders estritos do Deno Std, os processadores utilizam definições de tipos recursivos (`type` em vez de `interface`) com assinaturas de índice explícitas, garantindo que metadados customizados sejam serializados sem perda de informação.
-   **Validação Forense:** Cada processador extra é obrigado a validar a presença da assinatura e do resultado final (`finalResult`) antes de iniciar a serialização, impedindo a geração de rastros incompletos.
-   **Agnosticismo de Runtime:** Apesar de estarem no repositório Deno, os buffers gerados (Uint8Array) são compatíveis com qualquer ambiente que suporte os padrões RFC de cada formato.
