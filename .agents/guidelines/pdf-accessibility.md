# Diretrizes para PDFs Acessíveis

Um PDF acessível é um PDF "Tagueado" (Tagged PDF). Sem as tags, um leitor de tela verá apenas uma imagem em branco ou caracteres aleatórios.

## 1. Requisitos Críticos (WCAG PDF)
1. **Título do Documento:** O PDF deve ter um título configurado nos metadados.
2. **Linguagem:** O idioma principal (ex: pt-BR) deve estar definido.
3. **Tags de Estrutura:** Devem existir tags `<H1>`, `<P>`, `<Table>`, etc.
4. **Alternativa de Texto:** Todas as imagens dentro do PDF devem ter `alt text`.
5. **Ordem de Leitura:** A ordem em que o conteúdo é lido deve ser lógica.
6. **Contraste:** As cores dentro do PDF devem seguir as regras WCAG.

## 2. Como criar PDFs Acessíveis
- **Microsoft Word / Google Docs:** Use a estrutura de "Estilos" (Título 1, Título 2) e use a opção "Salvar como PDF" com as tags ativadas.
- **Adobe Acrobat Pro:** Use a ferramenta "Accessibility Check" e "Autotag Document".
- **NUNCA "imprima como PDF"**: Isso destrói todas as tags e torna o documento inacessível. Use sempre a opção de "Exportar" ou "Salvar como".

## 3. Links e Tabelas no PDF
- Links devem ter texto descritivo.
- Tabelas não devem ter células vazias ou layouts complexos se possível.

## 4. Onde Validar
Use o **PAC (PDF Accessibility Checker)**, que é o padrão ouro gratuito para verificar conformidade com PDF/UA (Universal Accessibility).
