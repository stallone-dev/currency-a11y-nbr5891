# Regras de Acessibilidade (eMAG e WCAG)

Este documento define as regras inegociáveis para este projeto, baseadas no eMAG (Modelo de Acessibilidade em Governo Eletrônico) e WCAG 2.1 AA.

## 1. Regras Fundamentais (WCAG)

A acessibilidade é baseada em 4 princípios:

### 1.1 Perceptível (Perceivable)
- **Alternativas de Texto:** Todo conteúdo não textual (imagens, vídeos) DEVE ter uma alternativa textual equivalente.
    - `img` DEVE ter `alt` descritivo ou vazio (`""`) se decorativo.
    - Vídeos DEVEM ter legendas e audiodescrição.
- **Conteúdo Adaptável:** O conteúdo DEVE ser estruturado semanticamente para permitir diferentes visualizações.
    - NÃO use tabelas para layout.
    - Use `h1` a `h6` para hierarquia lógica.
- **Distinguível:** O conteúdo DEVE ser fácil de ver e ouvir.
    - Contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande.
    - Use unidades relativas (`em`, `rem`, `%`) em vez de absolutas (`px`) para fontes e containers de texto.
    - NÃO transmita informação apenas por cor.

### 1.2 Operável (Operable)
- **Acessível por Teclado:** Toda funcionalidade DEVE ser operável via teclado.
    - O foco DEVE ser visível (`outline` não nulo).
    - Ordem de tabulação lógica e sequencial.
- **Tempo Suficiente:** Usuários DEVEM ter tempo para ler e usar o conteúdo.
    - Evite limites de tempo ou permita extensão.
- **Convulsões e Reações Físicas:** NÃO crie conteúdo que pisque mais de 3 vezes por segundo.
- **Navegabilidade:** Forneça maneiras de ajudar usuários a navegar e encontrar conteúdo.
    - Títulos de página (`<title>`) descritivos e únicos.
    - Links com propósito claro (evite "clique aqui").

### 1.3 Compreensível (Understandable)
- **Legível:** O conteúdo DEVE ser legível e compreensível.
    - Defina o idioma da página (`<html lang="pt-br">`).
- **Previsível:** O conteúdo deve operar de maneiras previsíveis.
    - Componentes com mesma funcionalidade DEVEM ser identificados consistentemente.
- **Assistência de Entrada:** Ajude usuários a evitar e corrigir erros.
    - Identifique erros em formulários claramente em texto.
    - Forneça instruções e rótulos (`label`) claros.

### 1.4 Robusto (Robust)
- **Compatível:** Maximize a compatibilidade com tecnologias assistivas atuais e futuras.
    - HTML válido e bem formado.
    - Uso correto de ARIA (apenas quando HTML nativo não for suficiente).
    - `name`, `role`, `value` definidos para componentes customizados.

## 2. Regras Específicas do eMAG (Brasil)

Além das diretrizes da WCAG, este projeto DEVE seguir as seguintes exigências do Governo Brasileiro:

### 2.1 Identidade Padrão
- **Barra de Acessibilidade:** Deve estar presente no topo de todas as páginas.
    - Atalhos de teclado padronizados (Ir para conteúdo [1], Ir para menu [2], Ir para busca [3], Ir para rodapé [4]).
    - Contraste, Tamanho da Fonte.
- **Barra de Governo:** Link para `brasil.gov.br` no topo.

### 2.2 Tecnologias Assistivas Brasileiras
- **VLibras:** A integração com o widget do VLibras é OBRIGATÓRIA.
    - O código do widget deve ser incluído antes do fechamento do `</body>`.

### 2.3 Validação Automática
- Utilize o validador ASES (ou ferramentas compatíveis) para verificar conformidade com o eMAG.
