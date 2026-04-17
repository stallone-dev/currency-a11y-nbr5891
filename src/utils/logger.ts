/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { getLogger, type Logger } from "@logtape";
import { LOG_NAMESPACE } from "../core/constants.ts";

/**
 * Pre-configured logger for the library using LogTape 2.0.
 */
export const logger: Logger = getLogger(LOG_NAMESPACE);

/**
 * Creates a sub-logger for specific namespaces.
 */
export function getSubLogger(subName: string): Logger {
    return getLogger([...LOG_NAMESPACE, subName]);
}

/**
 * TelemetrySpan - Gerenciador de Escopo para Telemetria de Performance.
 *
 * **Engenharia:** Utiliza o protocolo Explicit Resource Management (using) para
 * medir e logar a duração de operações sem a necessidade de wrappers de função.
 * Reduz a pressão sobre o Garbage Collector ao eliminar closures temporárias.
 */
export class TelemetrySpan implements Disposable {
    readonly #name: string;
    readonly #logger: Logger;
    readonly #options: unknown;
    readonly #start: number;

    constructor(name: string, logger: Logger, options: unknown) {
        this.#name = name;
        this.#logger = logger;
        this.#options = options;
        this.#start = performance.now();
    }

    /** Finaliza o span e emite o log de performance. */
    [Symbol.dispose]() {
        if (!this.#logger.isEnabledFor("info")) { return; }

        const end = performance.now();
        const durationMs = `${(end - this.#start).toFixed(4)}ms`;

        this.#logger.info("Output generated", {
            output_method: this.#name,
            duration: durationMs,
            options: this.#options,
        });
    }
}

/**
 * Inicia um novo span de telemetria para uso com a keyword 'using'.
 */
export function startSpan(name: string, logger: Logger, options: unknown = {}): TelemetrySpan | undefined {
    if (!logger.isEnabledFor("info")) { return undefined; }
    return new TelemetrySpan(name, logger, options);
}

/**
 * Utility to measure execution time of a function using the performance API.
 * Returns a tuple [result, durationInMsString].
 */
export function measureTime<T>(fn: () => T): [T, string] {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return [result, `${(end - start).toFixed(4)}ms`];
}
