/* Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
 *
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding/hex";
import { encodeBase64 } from "@std/encoding/base64";
import { encodeBase32 } from "@std/encoding/base32";
import { encodeBase58 } from "@std/encoding/base58";
import type { SignatureEncoder } from "./sanitizer.ts";

/**
 * Converte um dado qualquer em uma string canônica (determinística).
 * Implementa k-sort (ordenação alfabética de chaves) recursivo.
 *
 * @param data Dado a ser canonizado.
 * @returns String estável para geração de hash.
 */
export function canonicalString(data: unknown): string {
    if (data === null || typeof data !== "object") {
        return String(data);
    }

    if (data instanceof Date) {
        return data.toISOString();
    }

    if (Array.isArray(data)) {
        return "[" + data.map(canonicalString).join(",") + "]";
    }

    const keys = Object.keys(data as object).sort();
    return "{"
        + keys.map((key) => {
            const val = (data as Record<string, unknown>)[key];
            return `"${key}":${canonicalString(val)}`;
        }).join(",")
        + "}";
}

/**
 * Gera uma assinatura digital BLAKE3 com a codificação escolhida.
 *
 * @param data Conteúdo a ser assinado.
 * @param salt Sal secreto da instância.
 * @param encoderType Tipo de codificação (HEX, BASE64, BASE58, BASE32).
 * @returns Assinatura digital formatada.
 */
export async function generateSignature(
    data: unknown,
    salt: string,
    encoderType: SignatureEncoder,
): Promise<string> {
    const cString = canonicalString(data);
    const encoder = new TextEncoder();
    const payload = encoder.encode(cString + salt);

    const hashBuffer = await crypto.subtle.digest("BLAKE3", payload);
    const uint8 = new Uint8Array(hashBuffer);

    switch (encoderType) {
        case "BASE64":
            return encodeBase64(uint8);
        case "BASE32":
            return encodeBase32(uint8);
        case "BASE58":
            return encodeBase58(uint8);
        case "HEX":
        default:
            return encodeHex(uint8);
    }
}
