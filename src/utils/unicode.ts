/**
 * CalcAUY - Unicode Mathematical Glyphs Utilities
 * @module
 */

const SUPERSCRIPTS: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "+": "⁺",
    "-": "⁻",
    "=": "⁼",
    "(": "⁽",
    ")": "⁾",
    "/": "ᐟ",
    "n": "ⁿ",
    "i": "ⁱ",
    "^": "^",
};

const SUBSCRIPTS: Record<string, string> = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
    "+": "₊",
    "-": "₋",
    "=": "₌",
    "(": "₍",
    ")": "₎",
    "a": "ₐ",
    "b": "ᵦ", // Greek beta as homoglyph
    "e": "ₑ",
    "h": "ₕ",
    "i": "ᵢ",
    "j": "ⱼ",
    "k": "ₖ",
    "l": "ₗ",
    "m": "ₘ",
    "n": "ₙ",
    "o": "ₒ",
    "p": "ₚ",
    "r": "ᵣ",
    "s": "ₛ",
    "t": "ₜ",
    "u": "ᵤ",
    "v": "ᵥ",
    "x": "ₓ",
    // Standard Latin subscripts for c, d, f, g, q are still missing in Unicode.
};

/**
 * Converts a string to its Unicode superscript equivalent.
 */
export function toSuperscript(text: string): string {
    let result = "";
    for (const char of text) {
        const lowerChar = char.toLowerCase();
        result += SUPERSCRIPTS[lowerChar] || lowerChar;
    }
    return result;
}

/**
 * Converts a string to its Unicode subscript equivalent.
 */
export function toSubscript(text: string): string {
    let result = "";
    for (const char of text) {
        const lowerChar = char.toLowerCase();
        result += SUBSCRIPTS[lowerChar] || lowerChar;
    }
    return result;
}
