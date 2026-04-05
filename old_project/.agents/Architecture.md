# Arquitetura do Módulo de Acessibilidade (Portátil)

Este documento descreve a organização técnica do módulo de inteligência em acessibilidade, projetado para ser integrado em qualquer projeto de software para garantir conformidade com eMAG e WCAG.

## 1. Estrutura do Módulo (`.agents/`)

Este diretório funciona como um "Cérebro de Acessibilidade" autônomo:

```text
.agents/
├── checklists/         # Listas de verificação para QA e Dev
├── guidelines/         # Padrões de implementação (HTML, CSS, JS, etc.)
├── instructions/       # Persona e diretrizes de comportamento da IA
├── rules/              # Regras de negócio, leis e mapeamentos técnicos
├── skills/             # Procedimentos operacionais de auditoria manual
└── README.md           # Índice e guia de uso do módulo
```

## 2. Fluxo de Trabalho do Agente

O módulo orienta a IA através de três fases:
1.  **Conhecimento (`rules/`):** Definição técnica e jurídica do que deve ser alcançado.
2.  **Implementação (`guidelines/`):** Como escrever código acessível do zero ou refatorar componentes.
3.  **Validação (`skills/` & `checklists/`):** Como garantir que o resultado final atende aos padrões.

## 3. Fontes de Referência Oficiais (Externas)

Como este módulo é portátil, ele não armazena cópias locais das diretrizes, mas aponta para as fontes oficiais:
- **eMAG (Brasil):** [https://emag.governoeletronico.gov.br/](https://emag.governoeletronico.gov.br/)
- **WCAG 2.1 (W3C):** [https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)
- **WAI-ARIA Authoring Practices:** [https://www.w3.org/WAI/ARIA/apg/](https://www.w3.org/WAI/ARIA/apg/)

## 4. Diretrizes de Integração
Para usar este módulo em um novo projeto:
1. Copie a pasta `.agents/` para a raiz do seu projeto.
2. Instrua sua IA (ou utilize-a como contexto) a ler o arquivo `.agents/instructions/accessibility-agent.md` antes de qualquer tarefa de UI.
3. Utilize os `checklists/` em processos de Code Review.
