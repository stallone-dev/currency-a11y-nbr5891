# Checklist de Acessibilidade (Frontend)

## Estrutura e Semântica
- [ ] O documento tem `<!DOCTYPE html>`, `<html lang="pt-br">`?
- [ ] O título `<title>` é único e descritivo?
- [ ] Landmarks (`header`, `main`, `footer`, `nav`) usados corretamente?
- [ ] Apenas um `<h1>` por página?
- [ ] Títulos (`h2`-`h6`) seguem ordem lógica sem pular níveis?

## Mídia
- [ ] Todas as imagens `<img>` têm `alt`? (Descritivo ou vazio `""`)
- [ ] Vídeos têm legendas (captions)?
- [ ] Áudio/Vídeo têm transcrição ou alternativa textual?
- [ ] Áudio automático NÃO toca por mais de 3 segundos?

## Interação e Navegação
- [ ] Todo elemento interativo (`button`, `a`, `input`) é acessível via teclado?
- [ ] O foco é visível em todos os elementos (`:focus-visible`)?
- [ ] A ordem de tabulação segue a ordem visual/lógica?
- [ ] Links têm texto descritivo (evitar "clique aqui", "leia mais")?
- [ ] Links que abrem nova aba avisam o usuário (ícone ou texto oculto)?
- [ ] Botões têm rótulos claros (texto visível ou `aria-label`)?

## Formulários
- [ ] Todos os `input`, `textarea`, `select` têm `<label>` associado (`for`/`id`)?
- [ ] Erros de validação são identificados em texto (não só cor)?
- [ ] Mensagens de erro são associadas ao campo com `aria-describedby`?
- [ ] O foco é movido para o erro ou resumo de erros após submissão falha?

## Design e Cores
- [ ] O contraste de texto/fundo é suficiente (4.5:1 normal, 3:1 grande)?
- [ ] A cor não é a única forma de transmitir informação (ex: gráficos, status)?
- [ ] O layout suporta zoom de até 200% sem quebra horizontal?

## eMAG (GovBR)
- [ ] Barra de Acessibilidade no topo?
- [ ] Atalhos de teclado (Conteúdo [1], Menu [2], Busca [3], Rodapé [4]) funcionam?
- [ ] Widget VLibras presente?
- [ ] Barra do Governo Federal no topo?
