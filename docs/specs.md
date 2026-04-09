# Enciclopédia Técnica: Índice de Especificações

Para entender os fundamentos matemáticos e as decisões de design da CalcAUY, consulte as especificações numeradas abaixo.

## 🧠 Núcleo e Matemática (Core)
- **[Spec 01: RationalNumber](./specs/01-RationalNumber.md)** - A base de precisão (BigInt n/d).
- **[Spec 04: Engine](./specs/04-Calculation-Engine.md)** - Como os nós da árvore são colapsados.
- **[Spec 13: Arredondamento](./specs/13-Rounding-Strategies.md)** - NBR-5891, Half-Even e outras estratégias.
- **[Spec 15: Rigor e Performance](./specs/15-Code-Rigor-Performance.md)** - Regras de tipagem e otimizações de BigInt.

## 🏗️ Construção e Interface (API)
- **[Spec 02: Estrutura AST](./specs/02-AST-Structure.md)** - A anatomia da Árvore de Sintaxe Abstrata.
- **[Spec 03: Parser](./specs/03-Parser-Rules.md)** - Gramática PEMDAS para expressões em string.
- **[Spec 07: Precedência](./specs/07-Precedence-Rules.md)** - Hierarquia rigorosa de operações e associatividade.
- **[Spec 08: Ingestão Rigorosa](./specs/08-Input-Strict-Spec.md)** - O Lexer e a proteção de entrada.
- **[Spec 10: API Fluida](./specs/10-Fluent-Calculation-API.md)** - O Builder e o auto-agrupamento.

## 📡 Saída e Acessibilidade (Output)
- **[Spec 05: Processadores](./specs/05-Output-Processors.md)** - Tradução da AST para outros formatos.
- **[Spec 09: Interface de Saída](./specs/09-Output-Interface.md)** - Contrato do CalcAUYOutput.
- **[Spec 14: Internacionalização](./specs/14-Locales-Currencies.md)** - Suporte a múltiplos idiomas e moedas.
- **[Spec 16: Customização](./specs/16-Custom-Output-Processors.md)** - Injeção de formatadores externos (XML, CSV, etc).

## 🛡️ Infraestrutura e Segurança (Infra)
- **[Spec 00: Visão Panorâmica](./specs/00-Panoramic-Overview.md)** - Ponto de entrada e resumo arquitetural.
- **[Spec 06: Táticas de Segurança](./specs/06-Implementation-Tactics.md)** - Hard Privacy e Imutabilidade.
- **[Spec 11: Telemetria](./specs/11-Telemetry-Logging.md)** - Logs estruturados via LogTape 2.0.
- **[Spec 12: Erros](./specs/12-Error-Handling.md)** - Diagnósticos padrão RFC 7807.
- **[Spec 17: Política de PII](./specs/17-PII-Protection-Policy.md)** - Proteção de dados sensíveis nos logs.
- **[Spec 18: Processamento em Massa](./specs/18-Batch-Processing.md)** - Batch, Yielding e anti-bloqueio.

---
**Objetivo:** Garantir que a CalcAUY seja transparente, previsível e verificável por qualquer auditor técnico.
