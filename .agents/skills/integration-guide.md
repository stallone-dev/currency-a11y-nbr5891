---
name: module-integration
description: Guia para integrar este módulo de acessibilidade em novos projetos de software. Use esta skill quando precisar configurar o ambiente de acessibilidade em um repositório virgem ou transferir estas diretrizes para outro time.
---

# Guia de Integração do Agente de Acessibilidade

Este guia ensina como integrar o módulo de acessibilidade em um novo projeto de software para maximizar o uso por IAs e humanos.

## 1. Instalação
1. Copie o diretório `.agents/` para a raiz do seu repositório Git.
2. Certifique-se de que ele não está no `.gitignore`.

## 2. Configurando sua IA (Gemini, ChatGPT, Claude)
Sempre que iniciar uma tarefa de desenvolvimento de UI, dê a seguinte instrução para sua IA:
> "Antes de começarmos, por favor, leia as diretrizes de acessibilidade e o mindset do agente em `.agents/instructions/accessibility-agent.md` e utilize os padrões de código em `.agents/guidelines/`."

## 3. Integração com o Workflow de Desenvolvimento

### Durante a Codificação (Desenvolvimento)
Utilize os arquivos em `guidelines/` para copiar exemplos de componentes acessíveis (Modais, Forms, etc.).

### Durante o Code Review (PRs)
O revisor deve utilizar o `checklists/frontend-checklist.md` para validar o código do colega ou da própria IA.

### Auditoria Antes da Release
Execute o procedimento em `skills/accessibility-audit.md` para garantir que nada passou despercebido.

## 4. Ferramentas Recomendadas
Para usar em conjunto com este agente, instale:
- **axe DevTools** (Extensão de navegador)
- **WAVE** (Extensão de navegador)
- **NVDA** ou **VoiceOver** (Leitores de tela para teste manual)
- **ASES (Avaliador e Simulador de Acessibilidade em Sítios):** [https://asesweb.governoeletronico.gov.br/](https://asesweb.governoeletronico.gov.br/)
