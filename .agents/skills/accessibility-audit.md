---
name: accessibility-audit
description: Procedimento passo-a-passo para realizar uma auditoria completa de acessibilidade (eMAG/WCAG) em qualquer página web. Use esta skill ao finalizar uma feature de UI ou ao ser solicitado para validar a conformidade de uma página.
---

# Procedimento de Auditoria de Acessibilidade (eMAG/WCAG)

Este guia descreve como realizar uma auditoria completa em uma página web.

## Ferramentas Necessárias
- **Navegador:** Chrome ou Firefox.
- **Extensões:**
    - **axe DevTools** (Automático)
    - **WAVE** (Visualização de estrutura)
    - **HeadingsMap** (Hierarquia de títulos)
- **Leitor de Tela:** NVDA (Windows) ou VoiceOver (Mac).
- **Validador eMAG:** ASES (se disponível) ou checklist manual.

## Passo 1: Verificação Automática (30% dos erros)
1. Abra o **axe DevTools**.
2. Execute "Scan all of my page".
3. Corrija TODOS os erros críticos e sérios.
4. Verifique "Needs Review" manualmente.

## Passo 2: Navegação por Teclado (Essencial)
1. Desconecte o mouse (simbolicamente).
2. Use APENAS `Tab` (avançar), `Shift+Tab` (voltar), `Enter` (ativar link/botão), `Espaço` (ativar botão/checkbox), `Setas` (radio buttons/select).
3. **Verifique:**
    - [ ] Você consegue acessar todos os elementos interativos?
    - [ ] A ordem do foco é lógica (da esquerda para a direita, de cima para baixo)?
    - [ ] O foco é VISÍVEL em todos os elementos?
    - [ ] Você não ficou preso em nenhum elemento ("Keyboard Trap")?

## Passo 3: Verificação Visual e Semântica
1. **Zoom:** Aumente o zoom do navegador para **200%**.
    - [ ] O layout quebrou? O texto encavalou?
    - [ ] É necessário rolagem horizontal (exceto para tabelas/mapas)?
2. **Imagens:** Desative as imagens ou use uma ferramenta para ver os `alt`.
    - [ ] As imagens informativas têm descrições úteis?
    - [ ] As decorativas têm `alt=""`?
3. **Estrutura:** Use a extensão **HeadingsMap**.
    - [ ] Existe apenas um `h1`?
    - [ ] A hierarquia (`h2`, `h3`) faz sentido e não pula níveis?

## Passo 4: Validação com Leitor de Tela (NVDA/VoiceOver)
1. Ative o leitor de tela.
2. Navegue pelos cabeçalhos (`H` no NVDA).
3. Navegue pelos marcos (`D` ou `M` no NVDA).
4. Tente realizar as tarefas principais da página (ex: preencher um formulário).
    - [ ] Os rótulos dos campos são anunciados corretamente?
    - [ ] Mensagens de erro são lidas automaticamente?
    - [ ] Modais capturam o foco corretamente?

## Passo 5: Conformidade eMAG
1. **Barra de Acessibilidade:** Está presente e funcional?
2. **Atalhos:** `Alt + 1` leva ao conteúdo?
3. **VLibras:** O widget está carregando?
4. **Governo:** A barra do governo federal está visível?

## Relatório
Gere um relatório listando:
- Critério violado (ex: WCAG 1.4.3 - Contraste).
- Localização (URL/Screenshot).
- Severidade (Bloqueante, Crítico, Melhoria).
- Sugestão de correção.
