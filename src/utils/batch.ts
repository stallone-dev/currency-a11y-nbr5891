/**
 * CalcAUY - Utilitário de Processamento em Lotes (Batch Processing)
 * @module
 */

/**
 * Opções para configuração do processamento em lote.
 * @template ResultType - O tipo do valor resultante de cada tarefa ou do acúmulo final.
 */
export interface BatchOptions<ResultType = unknown> {
    /**
     * Tamanho de cada lote antes de ceder a execução (yielding).
     * @default 1000
     */
    batchSize?: number;
    /**
     * Número de fluxos concorrentes (Workers Lógicos).
     * Se > 0, os itens serão divididos em chunks processados paralelamente.
     * @default 0
     */
    logicalWorkers?: number;
    /**
     * Valor inicial para o acúmulo.
     * Obrigatório se um `reducer` for fornecido.
     */
    accumulator?: ResultType;
    /**
     * Função para combinar resultados de forma eficiente.
     * Se presente, o `processBatch` retornará um único valor do tipo `ResultType`.
     */
    reducer?: (accumulator: ResultType, current: ResultType) => ResultType;
    /**
     * Callback opcional chamado a cada lote concluído com o percentual de progresso (0-100).
     */
    onProgress?: (progress: number) => void;
}

/**
 * Processa um array de itens de forma assíncrona e em lotes, com suporte a
 * paralelismo lógico e acúmulo (redução) de massa.
 *
 * @template InputType - Tipo dos dados de entrada no array.
 * @template ResultType - Tipo do resultado gerado por cada tarefa.
 *
 * @param items Array de itens a serem processados.
 * @param task Função a ser executada para cada item (pode ser assíncrona).
 * @param options Configurações de lote, concorrência e acúmulo.
 */
export async function processBatch<InputType, ResultType>(
    items: InputType[],
    task: (item: InputType, index: number) => ResultType | Promise<ResultType>,
    options: BatchOptions<ResultType> & { reducer: (acc: ResultType, item: ResultType) => ResultType },
): Promise<ResultType>;

export async function processBatch<InputType, ResultType>(
    items: InputType[],
    task: (item: InputType, index: number) => ResultType | Promise<ResultType>,
    options?: BatchOptions<ResultType>,
): Promise<ResultType[]>;

export async function processBatch<InputType, ResultType>(
    items: InputType[],
    task: (item: InputType, index: number) => ResultType | Promise<ResultType>,
    options: BatchOptions<ResultType> = {},
): Promise<ResultType[] | ResultType> {
    const {
        batchSize = 1000,
        logicalWorkers = 0,
        accumulator,
        reducer,
        onProgress,
    } = options;

    const total = items.length;
    if (total === 0) {
        return reducer ? (accumulator as ResultType) : [];
    }

    // Estratégia de Workers Lógicos (Divide and Conquer por Chunks)
    if (logicalWorkers > 1) {
        const workerCount = Math.min(logicalWorkers, total);
        const chunkSize = Math.ceil(total / workerCount);
        const promises: Promise<ResultType[] | ResultType>[] = [];

        for (let i = 0; i < workerCount; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, total);
            const chunk = items.slice(start, end);

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

    // Fluxo Único
    return await processSingleStream(items, task, {
        batchSize,
        accumulator,
        reducer,
        totalItems: total,
        onProgress,
    });
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
