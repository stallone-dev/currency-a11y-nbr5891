# Regras de CI/CD para Acessibilidade

Se o projeto for integrado a um pipeline de CI/CD, estas regras DEVEM ser aplicadas para impedir que código inacessível entre em produção.

## 1. Regras de Bloqueio (Linter/Axe)
- [ ] Erros de nível `critical` ou `serious` encontrados pelo `axe-core` devem falhar a build.
- [ ] Falta de atributo `alt` em imagens `<img>` deve falhar o lint.
- [ ] Ausência de `lang` no `<html>` deve falhar o lint.

## 2. Padrões de Pull Request (PR)
Todo PR que altere a interface (UI) DEVE:
- [ ] Incluir screenshots ou vídeos mostrando a navegação via teclado.
- [ ] Confirmar que o foco está visível em todos os novos componentes.
- [ ] Incluir os resultados de um `axe-scan` no comentário do PR.

## 3. Cobertura de Testes
- [ ] Pelo menos 80% das páginas críticas devem ter um teste E2E de acessibilidade (`cy.checkA11y()`).

## 4. Auditoria Manual Regular
- [ ] Uma auditoria manual com leitor de tela deve ser realizada mensalmente ou antes de grandes releases.
