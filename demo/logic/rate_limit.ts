// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// --- Segurança e Rate Limiting ---
const RATE_LIMIT_WINDOW = 30000; // 30 segundos
const MAX_REQUESTS_PER_WINDOW = 10;
const requestLog = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = requestLog.get(ip) ?? [];
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
    recent.push(now);
    requestLog.set(ip, recent);
    return recent.length > MAX_REQUESTS_PER_WINDOW;
}
