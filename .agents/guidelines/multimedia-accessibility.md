# Diretrizes de Acessibilidade em Multimídia

Conteúdos de áudio e vídeo devem ser consumidos por todos, independentemente de deficiência auditiva ou visual.

## 1. Vídeo
Vídeos DEVEM ter:
- **Legendas (Captions):** Sincronizadas com a fala. Devem incluir sons importantes (ex: [música de suspense], [explosão]).
- **Audiodescrição (AD):** Uma faixa de áudio que descreve o que está acontecendo visualmente (ex: "O homem entra na sala e senta-se no sofá").
- **Transcrição Textual:** Uma página ou arquivo de texto contendo toda a fala e sons importantes do vídeo.

```html
<video controls>
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="captions" srclang="pt" label="Português" default>
  <track src="audiodescricao-pt.vtt" kind="descriptions" srclang="pt" label="Audiodescrição">
</video>
```

## 2. Áudio
Áudios (Podcasts, narrações) DEVEM ter:
- **Transcrição Completa:** Um link logo abaixo do áudio para a versão em texto.

## 3. Players de Vídeo Acessíveis
Se for criar um player customizado:
- Todos os controles (Play, Pause, Volume) devem ser acessíveis via teclado.
- Deve haver rótulos claros (`aria-label`) para cada botão.
- O player deve permitir mudar o contraste e tamanho da legenda.

## 4. Animações e Autoplay
- **Autoplay:** NUNCA inicie vídeos ou áudios automaticamente. Isso é extremamente confuso para usuários de leitores de tela.
- **Botão de Controle:** Se houver animações de fundo ou carrosséis automáticos, forneça um botão "Pausar/Play" visível e acessível.
- **Padrão eMAG:** Conteúdo que pisca ou cintila não deve ser usado (risco de convulsão).
