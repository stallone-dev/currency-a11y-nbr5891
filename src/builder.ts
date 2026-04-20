/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type {
    CalculationNode,
    GroupNode,
    LiteralNode,
    MetadataValue,
    OperationType,
    RationalValue,
} from "./ast/types.ts";
import { createCacheSession, getActiveSession, RationalNumber } from "./core/rational.ts";
import { validateMetadata } from "./core/metadata.ts";
import type { RoundingStrategy } from "./core/constants.ts";
import { evaluate } from "./ast/engine.ts";
import { CalcAUYOutput } from "./output.ts";
import { Lexer } from "./parser/lexer.ts";
import { Parser } from "./parser/parser.ts";
import { attachOp, validateASTNode } from "./ast/builder_utils.ts";
import { getSubLogger, startSpan } from "./utils/logger.ts";
import { sanitizeAST, securityPolicy, setGlobalSecurityPolicy, type SignatureEncoder } from "./utils/sanitizer.ts";
import { generateSignature } from "./utils/security.ts";
import { CalcAUYError } from "./core/errors.ts";

const logger = getSubLogger("engine");

/**
 * FinalizationRegistry para limpeza automática de chaves no cache global da AST.
 */
const astCacheRegistry = new FinalizationRegistry<string>((key) => {
    globalLiteralNodeCache.delete(key);
});

/**
 * Hot Cache - Referências fortes para nós da AST mais frequentes.
 */
const hotLiteralNodeCache = new Map<string, LiteralNode>();
const HOT_CACHE_LIMIT = 512;

/**
 * Cache Global Inteligente para reuso de nós literais "limpos".
 *
 * **Engenharia:** Utiliza Referências Fracas para permitir que o GC libere
 * nós da AST que não pertencem mais a nenhuma árvore de cálculo ativa.
 */
const globalLiteralNodeCache = new Map<string, WeakRef<LiteralNode>>();

export type InputValue = string | number | bigint | CalcAUY;

/**
 * CalcAUY - Builder Fluído para Construção de Árvores de Cálculo (AST).
 *
 * Esta classe é o ponto de partida para qualquer operação matemática na biblioteca.
 * Ela utiliza o padrão Builder para acumular operações em uma estrutura de árvore
 * imutável, permitindo que a avaliação matemática real seja postergada até o momento
 * do `commit()`.
 *
 * @class
 */
export class CalcAUY {
    readonly #ast: CalculationNode;

    private constructor(ast: CalculationNode) {
        this.#ast = ast;
    }

    /**
     * Define a política global de segurança e logging.
     *
     * **Engenharia:** Atua na 1ª camada de controle. Permite configurar a sensibilidade
     * dos logs (PII), o Salt secreto e a codificação (encoder) das assinaturas BLAKE3.
     *
     * @param policy Configuração da política (ex: { salt: "meu_segredo", encoder: "HEX" }).
     * @returns A classe CalcAUY para encadeamento.
     */
    public static setSecurityPolicy(policy: {
        sensitive?: boolean;
        salt?: string;
        encoder?: SignatureEncoder;
    }): typeof CalcAUY {
        setGlobalSecurityPolicy(policy);
        return CalcAUY;
    }

    /**
     * Inicia uma nova sessão de cache para otimização de memória em cálculos massivos.
     *
     * **Engenharia:** Ativa o Explicit Resource Management para gerenciar o ciclo de vida
     * de números e nós da AST de forma escopada. Útil em loops de milhões de registros.
     *
     * @returns Um objeto Disposable para uso com a keyword 'using'.
     *
     * @example
     * ```ts
     * {
     *   using _session = CalcAUY.createCacheSession();
     *   // Cálculos pesados aqui serão cacheados e limpos ao final do bloco.
     * }
     * ```
     */
    public static createCacheSession(): Disposable {
        return createCacheSession();
    }

    /**
     * Cria uma nova instância de CalcAUY a partir de um valor inicial.
     *
     * **Engenharia:** O valor de entrada é imediatamente convertido em um `RationalNumber`
     * (fração n/d) para garantir que a precisão seja preservada desde o primeiro nó da árvore.
     *
     * @param value - Aceita string (recomendado), number, bigint ou outra instância de CalcAUY.
     * @returns Uma nova instância de CalcAUY (Nó Literal).
     *
     * @example Exemplo Simples
     * ```ts
     * const calc = CalcAUY.from(100);
     * ```
     *
     * @example Operações Aninhadas
     * ```ts
     * const subCalc = CalcAUY.from(50).add(20);
     * const main = CalcAUY.from(subCalc).mult(2);
     * ```
     *
     * @example Cenário Real: Início de Fatura
     * ```ts
     * // Ingestão segura de valor vindo de um banco de dados ou input de usuário
     * const valorBase = CalcAUY.from("1250.50");
     * ```
     *
     * @example Cenário Real Complexo: Composição de Impostos
     * ```ts
     * const icms = CalcAUY.from("0.18");
     * const baseCalculo = CalcAUY.from("1000.00").add("50.00"); // Base + Frete
     * ```
     */
    public static from(value: InputValue): CalcAUY {
        if (value instanceof CalcAUY) { return value; }

        let inputStr = value.toString();

        // Normalização de percentual para originalInput (evita otimizações indesejadas e mantém rastro claro)
        if (typeof value === "string" && value.trim().endsWith("%")) {
            const cleanVal = value.trim().slice(0, -1).replaceAll("_", "");
            inputStr = `${cleanVal}/100`;
        }

        // Prioridade 1: Cache de Sessão (Escopado)
        const session = getActiveSession();
        const sessionCached = session?.getExtra<LiteralNode>(inputStr);
        if (sessionCached) {
            return new CalcAUY(sessionCached);
        }

        // Prioridade 2: Hot Cache (Referências Fortes)
        const hotCached = hotLiteralNodeCache.get(inputStr);
        if (hotCached) {
            return new CalcAUY(hotCached);
        }

        // Prioridade 3: Cold Cache (WeakRef)
        const globalRef = globalLiteralNodeCache.get(inputStr);
        const globalCached = globalRef?.deref();
        if (globalCached) {
            if (hotLiteralNodeCache.size < HOT_CACHE_LIMIT) {
                hotLiteralNodeCache.set(inputStr, globalCached);
            }
            if (logger.isEnabledFor("debug")) {
                logger.debug("CalcAUY Instance Created (Cached)", {
                    input_type: typeof value,
                    structure: sanitizeAST(globalCached),
                });
            }
            return new CalcAUY(globalCached);
        }

        const r: RationalNumber = RationalNumber.from(value);
        const node: LiteralNode = {
            kind: "literal",
            value: r.toJSON() as RationalValue,
            originalInput: inputStr,
        };

        // Armazenamento
        if (session) {
            session.setExtra(inputStr, node);
        } else {
            if (hotLiteralNodeCache.size < HOT_CACHE_LIMIT) {
                hotLiteralNodeCache.set(inputStr, node);
            }
            globalLiteralNodeCache.set(inputStr, new WeakRef(node));
            astCacheRegistry.register(node, inputStr);
        }

        if (logger.isEnabledFor("debug")) {
            logger.debug("CalcAUY Instance Created", {
                input_type: typeof value,
                structure: sanitizeAST(node),
            });
        }

        return new CalcAUY(node);
    }

    /**
     * Analisa uma string contendo uma expressão matemática complexa e a transforma em uma AST.
     *
     * **Engenharia:** Utiliza um Parser de Descida Recursiva que respeita a precedência
     * matemática padrão (PEMDAS). A expressão é tokenizada e validada antes de ser convertida em nós.
     *
     * @param expression - String como "(10 + 5) * 2 / 3".
     * @returns Instância de CalcAUY representando a árvore da expressão.
     *
     * @example Exemplo Simples
     * ```ts
     * const calc = CalcAUY.parseExpression("1 + 1");
     * ```
     *
     * @example Operações Aninhadas
     * ```ts
     * const calc = CalcAUY.parseExpression("(10 + 5) * (2 ^ 3)");
     * ```
     *
     * @example Cenário Real: Fórmula de Desconto Progressivo
     * ```ts
     * const formula = "1000 * (1 - 0.15) + 50"; // Valor * (1 - Desc) + Taxa
     * const calc = CalcAUY.parseExpression(formula);
     * ```
     *
     * @example Cenário Real Complexo: Juros Compostos
     * ```ts
     * // M = P * (1 + i) ^ n
     * const jurosComp = "5000 * (1 + 0.02) ^ 12";
     * const output = CalcAUY.parseExpression(jurosComp).commit();
     * ```
     */
    public static parseExpression(expression: string): CalcAUY {
        using _span = startSpan("parseExpression", logger, { expression });
        const lexer: Lexer = new Lexer(expression);
        const tokens = lexer.tokenize();
        const parser: Parser = new Parser(tokens);
        return new CalcAUY(parser.parse());
    }

    /**
     * Reconstrói um cálculo a partir de um estado salvo (JSON) e valida sua integridade.
     *
     * **Engenharia:** Além de reconstruir a árvore, este método verifica a assinatura
     * digital BLAKE3 usando o Salt fornecido (ou vazio por padrão). Se houver qualquer
     * alteração de 1 bit nos dados ou se a assinatura for inválida, lança um erro fatal.
     *
     * @param ast - Objeto serializado contendo 'data' (AST) e 'signature'.
     * @param config - Configuração de segurança (opcional).
     * @returns Instância hidratada pronta para novas operações.
     * @throws {CalcAUYError} 'integrity-critical-violation' se a validação falhar.
     */
    public static async hydrate(
        ast: CalculationNode | string | object,
        config: { salt?: string; encoder?: SignatureEncoder } = {},
    ): Promise<CalcAUY> {
        const fullConfig = { salt: "", ...config };
        await CalcAUY.checkIntegrity(ast, fullConfig);

        const data = typeof ast === "string" ? JSON.parse(ast) : ast;
        const node: CalculationNode = data.data || data.ast || data;

        validateASTNode(node);
        return new CalcAUY(node);
    }

    /**
     * Verifica a validade da assinatura de um cálculo serializado.
     *
     * **Engenharia:** Aceita tanto a string JSON bruta quanto o objeto já parseado.
     * Realiza o confronto do hash BLAKE3 usando o Salt e o Encoder fornecidos.
     *
     * @param ast - O rastro assinado (string JSON ou objeto).
     * @param config - Configuração de segurança (salt e encoder opcional).
     * @returns true se a assinatura for válida.
     * @throws {CalcAUYError} 'integrity-critical-violation' se a assinatura falhar.
     */
    public static async checkIntegrity(
        ast: CalculationNode | string | object,
        config: { salt: string; encoder?: SignatureEncoder },
    ): Promise<boolean> {
        let payload: Record<string, unknown>;

        if (typeof ast === "string") {
            try {
                payload = JSON.parse(ast);
            } catch {
                throw new CalcAUYError("invalid-syntax", "Falha ao processar JSON para verificação de assinatura.");
            }
        } else {
            payload = ast as Record<string, unknown>;
        }

        if (!payload || typeof payload !== "object" || !payload.signature) {
            throw new CalcAUYError(
                "integrity-critical-violation",
                "Assinatura de integridade ausente no rastro de auditoria.",
            );
        }

        const dataToVerify = payload.data || {
            ast: payload.ast,
            finalResult: payload.finalResult,
            strategy: payload.strategy,
        };

        const expectedHash = await generateSignature(
            dataToVerify,
            config.salt,
            config.encoder || securityPolicy.encoder,
        );

        if (payload.signature !== expectedHash) {
            throw new CalcAUYError(
                "integrity-critical-violation",
                "Violação de integridade detectada: a assinatura não confere com o conteúdo.",
                { expected: expectedHash, received: payload.signature as string },
            );
        }

        return true;
    }

    /**
     * Captura e serializa a árvore atual em uma string JSON pronta para persistência.
     * Engenharia: O JSON retornado contém o campo 'signature' para garantir integridade.
     */
    public async hibernate(): Promise<string> {
        const signature = await generateSignature(this.#ast, securityPolicy.salt, securityPolicy.encoder);
        return JSON.stringify({
            data: this.#ast,
            signature,
        });
    }

    /**
     * Retorna o objeto da Árvore de Sintaxe Abstrata (AST) no estado atual.
     */
    public getAST(): CalculationNode {
        return this.#ast;
    }

    /**
     * Anexa metadados de negócio ao nó atual da árvore.
     *
     * **Engenharia:** Fundamental para auditoria forense. Permite justificar cada
     * operação (ex: "ID da regra de imposto", "nome do operador", "timestamp").
     *
     * @param key - Chave do metadado.
     * @param value - Valor (deve ser serializável).
     * @returns Nova instância enriquecida.
     *
     * @example Exemplo Simples
     * ```ts
     * const calc = CalcAUY.from(100).setMetadata("owner", "user_1");
     * ```
     *
     * @example Operações Aninhadas
     * ```ts
     * const calc = CalcAUY.from(10).add(5).setMetadata("step", 1).mult(2).setMetadata("step", 2);
     * ```
     *
     * @example Cenário Real: Marcação de Tributo
     * ```ts
     * const calc = CalcAUY.from("500.00").mult("0.05")
     *   .setMetadata("tax_name", "ISS")
     *   .setMetadata("law_reference", "Artigo 123");
     * ```
     *
     * @example Cenário Real Complexo: Auditoria de Payroll
     * ```ts
     * const salario = CalcAUY.from(5000)
     *   .sub(400).setMetadata("reason", "inss")
     *   .sub(150).setMetadata("reason", "plano_saude")
     *   .setMetadata("process_id", "2026-04-07-payroll");
     * ```
     */
    public setMetadata(key: string, value: MetadataValue): CalcAUY {
        validateMetadata(value);
        const newAST: CalculationNode = {
            ...this.#ast,
            metadata: { ...(this.#ast.metadata), [key]: value },
        } as CalculationNode;

        if (logger.isEnabledFor("debug")) {
            logger.debug("Metadata Attached", {
                key,
                structure: sanitizeAST(newAST),
            });
        }

        return new CalcAUY(newAST);
    }

    /**
     * Envolve a expressão atual em um grupo (parênteses).
     *
     * **Engenharia:** Força a precedência matemática. Útil quando você quer isolar
     * um bloco de cálculo antes de aplicar uma nova operação multiplicativa.
     *
     * @returns Nova instância com Nó de Agrupamento.
     *
     * @example Exemplo Simples
     * ```ts
     * // Resulta em (10 + 5)
     * const calc = CalcAUY.from(10).add(5).group();
     * ```
     *
     * @example Operações Aninhadas
     * ```ts
     * // Sem group: 10 + 5 * 2 = 20
     * // Com group: (10 + 5) * 2 = 30
     * const calc = CalcAUY.from(10).add(5).group().mult(2);
     * ```
     *
     * @example Cenário Real: Cálculo de Base com Adicional
     * ```ts
     * // (Salário + Bônus) * Alíquota
     * const base = CalcAUY.from(3000).add(500).group().mult("0.15");
     * ```
     *
     * @example Cenário Real Complexo: Proporcionalidade de Multa
     * ```ts
     * // (Valor_Total / Dias_Mes) * Dias_Atraso * Taxa_Multa
     * const multa = CalcAUY.from(1000).div(30).group().mult(5).mult("0.02");
     * ```
     */
    public group(): CalcAUY {
        // Otimização: Evita parênteses redundantes em literais ou grupos já existentes.
        if (this.#ast.kind === "group" || this.#ast.kind === "literal") {
            return this;
        }

        const node: GroupNode = {
            kind: "group",
            child: this.#ast,
        };

        if (logger.isEnabledFor("debug")) {
            logger.debug("Grouping Applied", {
                structure: sanitizeAST(node),
            });
        }

        return new CalcAUY(node);
    }

    // --- Fluent Operations ---

    /** Adição Aritmética. */
    public add(value: InputValue): CalcAUY {
        return this.op("add", value);
    }
    /** Subtração Aritmética. */
    public sub(value: InputValue): CalcAUY {
        return this.op("sub", value);
    }
    /** Multiplicação. Respeita PEMDAS. */
    public mult(value: InputValue): CalcAUY {
        return this.op("mul", value);
    }
    /** Divisão Racional (Infinita até o commit). */
    public div(value: InputValue): CalcAUY {
        return this.op("div", value);
    }
    /** Potenciação. */
    public pow(value: InputValue): CalcAUY {
        return this.op("pow", value);
    }
    /** Módulo (Resto) Euclidiano. */
    public mod(value: InputValue): CalcAUY {
        return this.op("mod", value);
    }
    /** Divisão Inteira (Quociente). */
    public divInt(value: InputValue): CalcAUY {
        return this.op("divInt", value);
    }

    /**
     * Método interno para anexar operações na árvore.
     * @private
     */
    private op(type: OperationType, value: InputValue): CalcAUY {
        let rightNode: CalculationNode;
        let inputType: string;

        // Auto-Agrupamento Inteligente: Só envolve em grupo se não for um literal ou outro grupo.
        if (value instanceof CalcAUY) {
            const innerAST = value.#ast;
            if (innerAST.kind === "group" || innerAST.kind === "literal") {
                rightNode = innerAST;
            } else {
                rightNode = { kind: "group", child: innerAST };
            }
            inputType = "CalcAUY";
        } else {
            const r: RationalNumber = RationalNumber.from(value);
            rightNode = {
                kind: "literal",
                value: r.toJSON() as RationalValue,
                originalInput: value.toString(),
            };
            inputType = typeof value;
        }

        const newAST: CalculationNode = attachOp(this.#ast, type, rightNode);

        if (logger.isEnabledFor("debug")) {
            logger.debug("Node appended to AST", {
                operation: type,
                input_type: inputType,
                structure: sanitizeAST(newAST),
            });
        }

        return new CalcAUY(newAST);
    }

    /**
     * Finaliza a construção da árvore e inicia a fase de avaliação.
     *
     * **Engenharia:** Esta é a fase de transição. A AST é percorrida recursivamente,
     * colapsando frações racionais até chegar no resultado final. O arredondamento
     * só é aplicado aqui ou nos outputs, nunca durante a construção.
     *
     * @param options - Configurações de arredondamento.
     * @returns Uma instância de CalcAUYOutput contendo o resultado final e a AST.
     *
     * @example Exemplo Simples
     * ```ts
     * const res = await CalcAUY.from(10).add(5).commit();
     * ```
     *
     * @example Estratégia Customizada
     * ```ts
     * const res = await CalcAUY.from("1.255").commit({ roundStrategy: "HALF_EVEN" });
     * ```
     *
     * @example Cenário Real: Fechamento de Venda
     * ```ts
     * const total = await CalcAUY.from("99.90").mult(3).commit({ roundStrategy: "NBR5891" });
     * ```
     *
     * @example Cenário Real Complexo: Cálculo Fiscal com Truncagem
     * ```ts
     * // Muitos cálculos fiscais exigem TRUNCATE para não favorecer o contribuinte
     * const icms = await CalcAUY.from("1250.45").mult("0.18").commit({ roundStrategy: "TRUNCATE" });
     * ```
     */
    public async commit(options: { roundStrategy?: RoundingStrategy } = {}): Promise<CalcAUYOutput> {
        using _span = startSpan("commit", logger, options);
        const strategy: RoundingStrategy = options.roundStrategy ?? "NBR5891";
        const result: RationalNumber = evaluate(this.#ast);

        // Gera a assinatura de integridade do resultado consolidado
        const payload = {
            ast: this.#ast,
            finalResult: result.toJSON(),
            strategy,
        };
        const signature = await generateSignature(payload, securityPolicy.salt, securityPolicy.encoder);

        return new CalcAUYOutput(result, this.#ast, strategy, signature);
    }
}
