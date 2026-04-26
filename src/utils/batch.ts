/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { getSubLogger, startSpan } from "./logger.ts";
import { createCacheSession } from "../core/rational.ts";

const logger = getSubLogger("batch");

/**
 * Opções para configuração do processamento em lote (Batch Processing).
 *
 * **Engenharia:** Projetado para suportar volumes industriais de dados sem comprometer
 * a responsividade do sistema (Event Loop).
 *
 * @template ResultType - O tipo do valor resultante de cada tarefa ou do acúmulo final.
 */
export type BatchOptions<ResultType = unknown> = {
    /**
     * Tamanho de cada lote antes de ceder a execução (yielding).
     *
     * **Yielding:** A cada N itens, o utilitário pausa brevemente para permitir que o
     * Event Loop processe outras tarefas (I/O, requisições HTTP).
     * @default 1000
     */
    batchSize?: number;
    /**
     * Número de fluxos concorrentes (Workers Lógicos).
     *
     * **Paralelismo:** Se > 1, divide o array original em chunks e os processa
     * simultaneamente usando `Promise.all`. Ideal para tarefas pesadas de CPU.
     * @default 0
     */
    logicalWorkers?: number;
    /**
     * Valor inicial para o acúmulo (usado com o reducer).
     * Obrigatório se um `reducer` for fornecido.
     */
    accumulator?: ResultType;
    /**
     * Função para combinar resultados de forma eficiente (Pattern Reducer).
     *
     * Se presente, o `ProcessBatchAUY` retornará um único valor acumulado,
     * economizando memória ao não manter um array gigante de resultados.
     */
    reducer?: (accumulator: ResultType, current: ResultType) => ResultType;
    /**
     * Callback opcional chamado a cada lote concluído com o percentual de progresso (0-100).
     */
    onProgress?: (progress: number) => void;
    /**
     * Número total de itens (opcional).
     *
     * **Engenharia:** Útil para iteradores ou fluxos onde o tamanho total é conhecido
     * antecipadamente, permitindo que o `onProgress` reporte o percentual correto.
     */
    totalItems?: number;
};

/**
 * ProcessBatchAUY - Engine de Processamento em Massa com Anti-Bloqueio.
 *
 * **Arquitetura Forense:** Este utilitário resolve o problema de cálculos pesados
 * em ambientes Single Thread (JS/TS). Ele utiliza técnicas de **Yielding**,
 * **Logical Parallelism** e **Streaming** para processar volumes industriais de dados.
 *
 * @template InputType - Tipo dos dados de entrada (Array, Iterable ou AsyncIterable).
 * @template ResultType - Tipo do resultado gerado por cada tarefa.
 *
 * @param items - Conjunto de itens a serem processados.
 * @param task - Função a ser executada para cada item (pode ser assíncrona).
 * @param options - Configurações de lote, concorrência e acúmulo.
 * @returns Um array de resultados ou o valor acumulado final se um reducer for usado.
 */
export async function ProcessBatchAUY<InputType, ResultType>(
    items: InputType[] | Iterable<InputType> | AsyncIterable<InputType>,
    task: (item: InputType, index: number) => ResultType | Promise<ResultType>,
    options: BatchOptions<ResultType> & { reducer: (acc: ResultType, item: ResultType) => ResultType },
): Promise<ResultType>;

export async function ProcessBatchAUY<InputType, ResultType>(
    items: InputType[] | Iterable<InputType> | AsyncIterable<InputType>,
    task: (item: InputType, index: number) => ResultType | Promise<ResultType>,
    options?: BatchOptions<ResultType>,
): Promise<ResultType[]>;

export async function ProcessBatchAUY<InputType, ResultType>(
    items: InputType[] | Iterable<InputType> | AsyncIterable<InputType>,
    task: (item: InputType, index: number) => ResultType | Promise<ResultType>,
    options: BatchOptions<ResultType> = {},
): Promise<ResultType[] | ResultType> {
    const isArray = Array.isArray(items);
    const totalCount = isArray ? (items as InputType[]).length : options.totalItems;

    using _span = startSpan("ProcessBatchAUY", logger, {
        totalItems: totalCount,
        batchSize: options.batchSize,
        logicalWorkers: options.logicalWorkers,
        isStreaming: !isArray,
    });
    using _session = createCacheSession();

    const {
        batchSize = 1000,
        logicalWorkers = 0,
        accumulator,
        reducer,
        onProgress,
    } = options;

    if (isArray) {
        const arrayItems = items as InputType[];
        const total = arrayItems.length;
        if (total === 0) {
            return reducer ? (accumulator as ResultType) : [];
        }

        // Estratégia de Workers Lógicos (Só para Arrays)
        if (logicalWorkers > 1) {
            const workerCount = Math.min(logicalWorkers, total);
            const chunkSize = Math.ceil(total / workerCount);
            const promises: Promise<ResultType[] | ResultType>[] = [];

            for (let i = 0; i < workerCount; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, total);
                const chunk = arrayItems.slice(start, end);

                promises.push(
                    processSingleStream(chunk, task, {
                        batchSize,
                        accumulator: reducer ? accumulator : undefined,
                        reducer,
                        startIndex: start,
                        totalItems: total,
                        onProgress,
                    }),
                );
            }

            const chunkResults = await Promise.all(promises);

            if (reducer) {
                let finalAcc: ResultType = accumulator as ResultType;
                for (const res of chunkResults) {
                    finalAcc = reducer(finalAcc, res as ResultType);
                }
                if (onProgress) { onProgress(100); }
                return finalAcc;
            }

            if (onProgress) { onProgress(100); }
            return (chunkResults as ResultType[][]).flat();
        }

        // Fluxo Único (Array)
        return await processSingleStream(arrayItems, task, {
            batchSize,
            accumulator,
            reducer,
            totalItems: total,
            onProgress,
        });
    }

    // Fluxo Streaming (Iterable / AsyncIterable)
    return await processIteratorStream(items as AsyncIterable<InputType>, task, {
        batchSize,
        accumulator,
        reducer,
        totalItems: totalCount,
        onProgress,
    });
}

/** Fluxo interno para processamento de iteradores (Streaming). */
async function processIteratorStream<InputType, ResultType>(
    items: Iterable<InputType> | AsyncIterable<InputType>,
    task: (item: InputType, index: number) => ResultType | Promise<ResultType>,
    options: {
        batchSize: number;
        accumulator?: ResultType | undefined;
        reducer?: ((acc: ResultType, item: ResultType) => ResultType) | undefined;
        totalItems?: number | undefined;
        onProgress?: ((p: number) => void) | undefined;
    },
): Promise<ResultType[] | ResultType> {
    const { batchSize, accumulator, reducer, totalItems, onProgress } = options;
    const isAccumulating = reducer !== undefined;
    let acc: ResultType = accumulator as ResultType;
    const results: ResultType[] = isAccumulating ? [] : [];

    let index = 0;
    for await (const item of items) {
        const res = await task(item, index);

        if (isAccumulating) {
            acc = reducer(acc, res);
        } else {
            results.push(res);
        }

        index++;

        if (index % batchSize === 0) {
            if (onProgress && totalItems) {
                onProgress(Math.round((index / totalItems) * 100));
            }

            // @ts-ignore: scheduler API
            if (typeof globalThis.scheduler?.yield === "function") {
                // @ts-ignore: scheduler API
                await globalThis.scheduler.yield();
            } else {
                await new Promise((resolve) => setTimeout(resolve, 0));
            }
        }
    }

    if (onProgress) {
        onProgress(100);
    }

    return isAccumulating ? acc : results;
}

/** Fluxo interno de processamento sequencial para um worker ou chunk. */
async function processSingleStream<InputType, ResultType>(
    items: InputType[],
    task: (item: InputType, index: number) => ResultType | Promise<ResultType>,
    options: {
        batchSize: number;
        accumulator?: ResultType | undefined;
        reducer?: ((acc: ResultType, item: ResultType) => ResultType) | undefined;
        startIndex?: number;
        totalItems: number;
        onProgress?: ((p: number) => void) | undefined;
    },
): Promise<ResultType[] | ResultType> {
    const { batchSize, accumulator, reducer, startIndex = 0, totalItems, onProgress } = options;
    const isAccumulating = reducer !== undefined;
    let acc: ResultType = accumulator as ResultType;
    const results: ResultType[] = isAccumulating ? [] : new Array(items.length);

    for (let i = 0; i < items.length; i++) {
        // deno-lint-ignore no-await-in-loop
        const res = await task(items[i], startIndex + i);

        if (isAccumulating) {
            acc = reducer(acc, res);
        } else {
            results[i] = res;
        }

        if ((i + 1) % batchSize === 0 && i < items.length - 1) {
            if (onProgress) {
                const currentGlobal = startIndex + i + 1;
                onProgress(Math.round((currentGlobal / totalItems) * 100));
            }

            // @ts-ignore: scheduler API
            if (typeof globalThis.scheduler?.yield === "function") {
                // @ts-ignore: scheduler API
                // deno-lint-ignore no-await-in-loop
                await globalThis.scheduler.yield();
            } else {
                // deno-lint-ignore no-await-in-loop
                await new Promise((resolve) => setTimeout(resolve, 0));
            }
        }
    }

    if (!options.startIndex && onProgress) {
        onProgress(100);
    }
    return isAccumulating ? acc : results;
}
