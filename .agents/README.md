# Módulo Portátil de Acessibilidade (eMAG/WCAG)

Este diretório é um módulo autônomo projetado para ser integrado em qualquer projeto de software. Ele contém a base de conhecimento necessária para implementação e auditoria de acessibilidade, focada no padrão brasileiro eMAG e nas diretrizes internacionais WCAG.

## Estrutura

### 📜 Regras (`/rules`)
Regras inegociáveis que devem ser seguidas.
- [Regras Fundamentais (eMAG + WCAG)](./rules/accessibility-core.md)
- [Regras de CI/CD e Qualidade](./rules/automated-ci-rules.md)
- [Mapeamento de Recomendações eMAG 3.1](./rules/emag-3-1-mapping.md)
- [Contexto Jurídico Brasileiro (LBI)](./rules/legal-context-brazil.md)

### 🛠️ Diretrizes Técnicas (`/guidelines`)
Como implementar corretamente.
- [HTML Semântico](./guidelines/semantic-html.md)
- [Padrões ARIA](./guidelines/aria-patterns.md)
- [CSS Acessível](./guidelines/css-a11y.md)
- [JavaScript e Interatividade](./guidelines/javascript-patterns.md)
- [Barra de Acessibilidade e VLibras (eMAG)](./guidelines/emag-implementation.md)
- [Testes Automatizados (axe-core)](./guidelines/testing-automation.md)
- [Redação e UX de Conteúdo](./guidelines/content-ux.md)
- [Gráficos e SVGs](./guidelines/data-visualization.md)
- [Acessibilidade em PDFs](./guidelines/pdf-accessibility.md)
- [Navegação em SPAs](./guidelines/spa-navigation.md)
- [Guia de Formulários Acessíveis](./guidelines/forms-deep-dive.md)
- [Acessibilidade Mobile](./guidelines/mobile-accessibility.md)
- [Multimídia (Áudio e Vídeo)](./guidelines/multimedia-accessibility.md)
- [Acessibilidade Cognitiva e Neurodiversidade](./guidelines/cognitive-accessibility.md)

### 🧠 Skills e Procedimentos (`/skills`)
Guias passo-a-passo para tarefas complexas.
- [Como auditar uma página](./skills/accessibility-audit.md)
- [Guia de Integração do Módulo](./skills/integration-guide.md)

### 🤖 Instruções para Agentes (`/instructions`)
Diretrizes para IAs que operam neste projeto.
- [Mindset do Agente de Acessibilidade](./instructions/accessibility-agent.md)

### ✅ Checklists (`/checklists`)
Listas rápidas para validação.
- [Checklist Frontend](./checklists/frontend-checklist.md)

## Como Usar
Ao pedir para implementar uma feature ou corrigir um bug:
1. **Consulte as Regras** para entender os requisitos.
2. **Use os Guidelines** para copiar padrões de código seguros.
3. **Valide com o Checklist** antes de entregar.
