import { CurrencyNBRError } from "../errors.ts";

/**
 * Utilitários matemáticos de alta precisão otimizados para o tipo BigInt.
 */

/**
 * Calcula a potência de um BigInt usando o algoritmo de exponenciação binária (Square-and-Multiply).
 *
 * @param base A base do cálculo.
 * @param exponent O expoente (deve ser não-negativo).
 * @returns O resultado da base elevada ao expoente.
 */
export function calculateBigIntPower(base: bigint, exponent: bigint): bigint {
    if (exponent < 0n) {
        throw new CurrencyNBRError({
            type: "negative-exponent",
            title: "Operação de Potência Inválida",
            detail: "Expoentes negativos não são suportados para operações de potência com BigInt nesta biblioteca.",
            operation: "power",
        });
    }
    if (exponent === 0n) { return 1n; }
    if (exponent === 1n) { return base; }

    let result = 1n;
    let currentBase = base;
    let currentExponent = exponent;

    while (currentExponent > 0n) {
        if (currentExponent % 2n === 1n) {
            result *= currentBase;
        }
        currentBase *= currentBase;
        currentExponent /= 2n;
    }
    return result;
}

/**
 * Calcula a raiz n-ésima de um BigInt utilizando o método de Newton-Raphson.
 *
 * @param value O valor do radicando.
 * @param rootIndex O índice da raiz (ex: 2 para quadrada, 3 para cúbica).
 * @returns A parte inteira da raiz calculada.
 */
 export function calculateNthRoot(value: bigint, rootIndex: bigint): bigint {
   if (rootIndex <= 0n) {
       throw new CurrencyNBRError({
           type: "invalid-root-index",
           title: "Operação de Raiz Inválida",
           detail: "O índice da raiz deve ser um número inteiro positivo.",
           operation: "root",
       });
   }
   if (value < 0n && rootIndex % 2n === 0n) {
       throw new CurrencyNBRError({
           type: "even-root-of-negative",
           title: "Operação de Raiz Inválida",
           detail: "Não é possível calcular a raiz par de um número negativo (resultado complexo não suportado).",
           operation: "root",
       });
   }
   if (rootIndex === 1n) return value;

       const isValueNegative = value < 0n;
       const absoluteValue = isValueNegative ? -value : value;

       // 2. Estimativa inicial otimizada (Overestimate obrigatório)
       const bitLength = getBitLengthFast(absoluteValue);
       let currentGuess = 1n << (bitLength / rootIndex + 1n);

       // 3. SELETOR DE MOTOR
       // Índices baixos (ex: até 10) -> Newton-Raphson (Velocidade Pura)
       // Índices altos -> Busca Binária (Estabilidade Pura)
       if (rootIndex <= 10n) {
           while (true) {
               const previousGuess = currentGuess;
               // Usamos o operador ** aqui pois em índices baixos o V8 é muito otimizado
               const guessPowMinusOne = previousGuess ** (rootIndex - 1n);

               // Newton-Raphson Step
               currentGuess = ((rootIndex - 1n) * previousGuess + absoluteValue / guessPowMinusOne) / rootIndex;

               // Condição de parada para inteiros
               if (currentGuess >= previousGuess - 1n && currentGuess <= previousGuess + 1n) break;
           }

           // Ajuste fino final para truncamento de inteiro
           if (currentGuess ** rootIndex > absoluteValue) {
               while (currentGuess ** rootIndex > absoluteValue) currentGuess--;
           } else {
               while ((currentGuess + 1n) ** rootIndex <= absoluteValue) currentGuess++;
           }
           return isValueNegative ? -currentGuess : currentGuess;

       } else {
           // MOTOR DE BUSCA BINÁRIA (Safe Path)
           let low = 1n;
           let high = currentGuess; // Reutiliza a estimativa de bit shift como teto
           let bestGuess = 1n;

           while (low <= high) {
               const mid = (low + high) >> 1n; // Bit shift para divisão por 2 ultra-rápida
               const midPow = calculateBigIntPower(mid, rootIndex);

               if (midPow === absoluteValue) return isValueNegative ? -mid : mid;

               if (midPow < absoluteValue) {
                   bestGuess = mid;
                   low = mid + 1n;
               } else {
                   high = mid - 1n;
               }
           }
           return isValueNegative ? -bestGuess : bestGuess;
       }
   }

/**
 * Calcula a potência fracionária de um BigInt com um fator de escala.
 * Representa matematicamente: (base / scale) ^ (num / den) * scale
 * Simplificado para: nthRoot(base^num * scale^(den-num), den)
 *
 * @param base O valor base (já escalonado).
 * @param num O numerador do expoente.
 * @param den O denominador do expoente.
 * @param scale O fator de escala interna.
 * @returns O resultado da operação, escalonado.
 */
export function calculateFractionalPower(base: bigint, num: bigint, den: bigint, scale: bigint): bigint {
    if (den <= 0n) {
        throw new CurrencyNBRError({
            type: "invalid-root-index",
            title: "Operação de Raiz Inválida",
            detail: "O denominador de um expoente fracionário deve ser um número inteiro positivo.",
            operation: "power",
        });
    }

    const exponentDiff = den - num;

    let radicand: bigint;
    if (exponentDiff >= 0n) {
        radicand = calculateBigIntPower(base, num) * calculateBigIntPower(scale, exponentDiff);
    } else {
        // Quando num > den, o expoente de scale (den - num) é negativo.
        // Representa (base^num / scale^(num - den)).
        radicand = calculateBigIntPower(base, num) / calculateBigIntPower(scale, -exponentDiff);
    }

    return calculateNthRoot(radicand, den);
}

/**
 * Estima a quantidade de bits de um BigInt de forma ultra-rápida.
 * Utiliza conversão hexadecimal para evitar os gargalos do Garbage Collector.
 */
function getBitLengthFast(value: bigint): bigint {
    if (value === 0n) { return 0n; }

    let bits = 1n;
    let temp = value;

    // Desloca 64 bits de uma vez para devorar números enormes muito rápido
    while (temp >= 18446744073709551616n) { // 2^64
        temp >>= 64n;
        bits += 64n;
    }
    // Desloca os bits restantes 1 a 1
    while (temp >= 2n) {
        temp >>= 1n;
        bits += 1n;
    }

    return bits;
}
