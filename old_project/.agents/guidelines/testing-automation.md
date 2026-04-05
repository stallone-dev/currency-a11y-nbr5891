# Diretrizes de Testes Automatizados de Acessibilidade

Para garantir que a acessibilidade não sofra regressões, utilizamos testes automatizados baseados no `axe-core`.

## 1. Testes de Unidade/Componente (Jest + axe-core)
Valide componentes isolados antes mesmo de chegarem à tela.

```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('o componente Button deve ser acessível', async () => {
  const { container } = render(<MyButton>Clique aqui</MyButton>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 2. Testes de E2E (Cypress + cypress-axe)
Valide a página inteira em um navegador real.

```javascript
describe('Auditoria de Acessibilidade na Home', () => {
  it('Deve passar nos testes do axe', () => {
    cy.visit('/');
    cy.injectAxe();
    
    // Testa a página no carregamento
    cy.checkA11y();
    
    // Testa após abrir um modal
    cy.get('#abrir-modal').click();
    cy.checkA11y('#modal-container');
  });
});
```

## 3. Playwright (axe-playwright)
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('página deve ser acessível', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## O que o automático NÃO pega (Obrigatório Manual):
- Ordem de tabulação lógica.
- Qualidade do texto `alt` (ele só vê se existe).
- Se o leitor de tela faz sentido contextualmente.
- Se o contraste em gradientes complexos é real.
