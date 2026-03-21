import { assertEquals, assertNotEquals, assertThrows } from "@std/assert";
import { AuditableAmount } from "./mod.ts";

// --- 1. TESTES DE FUNCIONALIDADE CORE ---

Deno.test("AuditableAmount - Criação e Parse", () => {
  assertEquals(AuditableAmount.from("123.45").commit(6), "123.450000");
  assertEquals(AuditableAmount.from(123).commit(6), "123.000000");

  const amount = AuditableAmount.from("0.1234567890125");
  const expectedInternalValue = 123456789013n;
  // @ts-ignore - Acessando propriedade privada para validação de integridade
  assertEquals((amount as any).activeTermValue, expectedInternalValue);
});

Deno.test("AuditableAmount - Operações Básicas e Precedência", () => {
  const calculation = AuditableAmount.from(10).add(5).mult(2);
  assertEquals(calculation.commit(2), "20.00");
  assertEquals(calculation.toLaTeX(2), "$$ 10 + 5 \\times 2 = 20.00 $$");

  const groupedCalculation = AuditableAmount.from(10).add(5).group().mult(2);
  assertEquals(groupedCalculation.commit(2), "30.00");
  assertEquals(
    groupedCalculation.toLaTeX(2),
    "$$ \\left( 10 + 5 \\right) \\times 2 = 30.00 $$",
  );

  const divisionSubtraction = AuditableAmount.from(100).div(4).sub(5);
  assertEquals(divisionSubtraction.commit(2), "20.00");
  assertEquals(divisionSubtraction.toLaTeX(2), "$$ \\frac{100}{4} - 5 = 20.00 $$");
});

Deno.test("AuditableAmount - Exponenciação", () => {
  const power = AuditableAmount.from(3).pow(2);
  assertEquals(power.commit(2), "9.00");
  assertEquals(power.toLaTeX(2), "$$ {3}^{2} = 9.00 $$");

  const squareRoot = AuditableAmount.from(81).pow("1/2");
  assertEquals(squareRoot.commit(2), "9.00");

  const cubicRootPower = AuditableAmount.from(8).pow("2/3");
  assertEquals(cubicRootPower.commit(2), "4.00");
  assertEquals(cubicRootPower.toLaTeX(2), "$$ \\sqrt[3]{8^{2}} = 4.00 $$");
});

Deno.test("AuditableAmount - Arredondamento ABNT NBR 5891", () => {
  assertEquals(AuditableAmount.from("1.225").commit(2), "1.22"); // Par
  assertEquals(AuditableAmount.from("1.235").commit(2), "1.24"); // Ímpar
  assertEquals(AuditableAmount.from("1.225000000001").commit(2), "1.23"); // 5 seguido de não-zero
});

Deno.test("AuditableAmount - Expressão Complexa", () => {
  // sqrt((100 * 1.05) + (200 / 2))
  const term1 = AuditableAmount.from(100).mult("1.05");
  const term2 = AuditableAmount.from(200).div(2);
  const finalResult = term1.add(term2).group().pow("1/2");

  assertEquals(finalResult.commit(4), "14.3178");
  assertEquals(
    finalResult.toLaTeX(4),
    "$$ \\sqrt[2]{\\left( 100 \\times 1.05 + \\frac{200}{2} \\right)} = 14.3178 $$",
  );
});

// --- 2. TESTES DE ACESSIBILIDADE (WCAG AAA) ---

Deno.test("Accessibility (WCAG AAA) - Narração Verbal Básica", () => {
  const simple = AuditableAmount.from(10).add(5).sub(2);
  assertEquals(simple.toVerbal(2), "10 mais 5 menos 2 é igual a 13 vírgula 00");

  const multDiv = AuditableAmount.from(100).mult(2).div(10);
  assertEquals(
    multDiv.toVerbal(0),
    "100 multiplicado por 2 dividido por 10 é igual a 20 vírgula 0",
  );
});

Deno.test("Accessibility (WCAG AAA) - Narração de Grupos e Precedência", () => {
  const grouped = AuditableAmount.from(10).add(5).group().mult(2);
  assertEquals(
    grouped.toVerbal(2),
    "em grupo, 10 mais 5, fim do grupo multiplicado por 2 é igual a 30 vírgula 00",
  );
});

Deno.test("Accessibility (WCAG AAA) - Narração de Raízes e Potências", () => {
  const root = AuditableAmount.from(8).pow("1/3");
  assertEquals(root.toVerbal(0), "raiz de índice 3 de 8 é igual a 2 vírgula 0");

  const complexPow = AuditableAmount.from(8).pow("2/3");
  assertEquals(complexPow.toVerbal(0), "raiz de índice 3 de 8 elevado a 2 é igual a 4 vírgula 0");
});

Deno.test("Accessibility (WCAG AAA) - Cenário Financeiro Real", () => {
  const juros = AuditableAmount.from(1000).mult(AuditableAmount.from(1).add("0.05").group());
  const expected =
    "1000 multiplicado por em grupo, 1 mais 0,05, fim do grupo é igual a 1050 vírgula 00";
  assertEquals(juros.toVerbal(2), expected);
});

// --- 3. TESTES DE ESTRESSE E CASOS EXTREMOS ---

Deno.test("Stress & Edge Cases - Entradas Inválidas (Cast Hacks)", () => {
  assertThrows(() => AuditableAmount.from(null as any));
  assertThrows(() => AuditableAmount.from(undefined as any));
  assertThrows(() => AuditableAmount.from(""));
  assertThrows(() => AuditableAmount.from("abc"));
  assertThrows(() => AuditableAmount.from("1.2.3"));
  assertThrows(() => AuditableAmount.from({} as any));
  assertThrows(() => AuditableAmount.from(NaN));
  assertThrows(() => AuditableAmount.from(Infinity));
});

Deno.test("Stress & Edge Cases - Valores Extremos", () => {
  const big = "999999999999999999999999999999";
  assertEquals(AuditableAmount.from(big).commit(2), big + ".00");

  const smallArroundDown = AuditableAmount.from("0.0000000000004");
  assertEquals(smallArroundDown.commit(12), "0.000000000000");

  const smallArroundUp = AuditableAmount.from("0.0000000000005");
  assertEquals(smallArroundUp.commit(12), "0.000000000001");
});

Deno.test("Stress & Edge Cases - Operações de Longa Cadeia", () => {
  let calc = AuditableAmount.from(0);
  for (let i = 0; i < 1000; i++) calc = calc.add(1);
  assertEquals(calc.commit(0), "1000.0");
  const latex = calc.toLaTeX(0);
  assertEquals(latex.includes("1 + 1 + 1"), true);
});

Deno.test("Stress & Edge Cases - Alta Complexidade e Nesting", () => {
  let calc = AuditableAmount.from(1);
  for (let i = 0; i < 50; i++) calc = calc.add(1).group();
  assertEquals(calc.commit(0), "51.0");

  const op = AuditableAmount.from(2).pow(10).div(1024).add(
    AuditableAmount.from(100).pow("1/2").mult("0.1"),
  ).group().pow(2);
  assertEquals(op.commit(2), "4.00");
});

Deno.test("Stress & Edge Cases - Erros Matemáticos", () => {
  assertThrows(() => AuditableAmount.from(10).div(0), Error, "Division by zero");
  assertThrows(
    () => AuditableAmount.from(-1).pow("1/2"),
    Error,
    "Cannot calculate even root of a negative number.",
  );
  assertThrows(() => AuditableAmount.from(10).pow("1/0"));
});

Deno.test("Stress & Edge Cases - Assincronismo e Concorrência", async () => {
  const values = Array.from({ length: 50 }, (_, i) => i);
  const results = await Promise.all(values.map(async (v) => {
    await new Promise((r) => setTimeout(r, Math.random() * 5));
    return AuditableAmount.from(v).mult(2).commit(0);
  }));
  results.forEach((res, i) => assertEquals(res, (i * 2).toString() + ".0"));
});

// --- 4. TESTES COMPREENSIVOS (IMUTABILIDADE E LEIS) ---

Deno.test("Comprehensive - Verificação de Imutabilidade", () => {
  const original = AuditableAmount.from(100);
  const d1 = original.add(50);
  const d2 = original.mult(2);
  const d3 = original.group();

  assertEquals(original.commit(2), "100.00");
  assertNotEquals(original, d1);
  assertNotEquals(original, d2);
  assertNotEquals(original, d3);
});

Deno.test("Comprehensive - Simulação Financeira (Juros Compostos)", () => {
  const principal = AuditableAmount.from(1000);
  const taxa = AuditableAmount.from(1).add(0.05).group();
  const montante = principal.mult(taxa.pow(12));

  assertEquals(montante.commit(2), "1795.86");
  const latex = montante.toLaTeX(2);
  assertEquals(latex.includes("1000 \\times {\\left( 1 + 0.05 \\right)}^{12}"), true);
});

Deno.test("Comprehensive - Leis Matemáticas", () => {
  const a = AuditableAmount.from("123.456789");
  const b = AuditableAmount.from("987.654321");
  const c = AuditableAmount.from("50.5");

  assertEquals(a.add(b).commit(6), b.add(a).commit(6));
  assertEquals(a.mult(b).commit(6), b.mult(a).commit(6));

  const res1 = a.mult(b.add(c).group()).commit(10);
  const res2 = a.mult(b).add(a.mult(c)).commit(10);
  assertEquals(res1, res2);
});
