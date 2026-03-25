import { CalcAUD } from "./mod.ts";

CalcAUD;
const preco = CalcAUD.from("150.50");
const total = preco
    .sub(preco.mult("0.15")) // Aplica desconto
    .group() // Agrupa para auditoria visual
    .add("25.00"); // Soma frete

const output = total.commit(2, { locale: "pt-BR", currency: "BRL" });

console.log(output.toUnicode());
