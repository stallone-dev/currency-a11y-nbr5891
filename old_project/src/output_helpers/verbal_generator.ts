// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * @module VerbalGenerator
 * Utilitários básicos para geração de frases verbais.
 */

/**
 * Gera uma descrição verbal simples para acessibilidade.
 *
 * Esta função realiza uma substituição básica de símbolos por termos
 * legíveis para humanos em contextos onde a localização completa
 * não é necessária ou como fallback.
 *
 * @param verbalExpression A expressão verbal acumulada.
 * @param result O resultado formatado em string.
 * @returns A frase completa verbalizada.
 */
export function generateVerbal(verbalExpression: string, result: string): string {
    // Substituímos o ponto decimal por 'vírgula' para melhorar a fluidez em leitores de tela.
    const readableResult = result.replace(".", " vírgula ");
    return `${verbalExpression} é igual a ${readableResult}`;
}
