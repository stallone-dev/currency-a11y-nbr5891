import { describe, it } from "@std/testing/bdd";
import { assertStringIncludes } from "@std/assert";
import { CalcAUY } from "@src/main.ts";

describe("Output: Verbal A11y (Accessibility)", () => {
    const Engine = CalcAUY.create({
        contextLabel: "a11y-test",
        salt: "salt",
        roundStrategy: "HALF_UP"
    });

    it("toVerbalA11y: deve gerar descrição em pt-BR", async () => {
        const output = await Engine.from(12.5).mult(0.15).commit();
        const res = output.toVerbalA11y({ locale: "pt-BR" });
        
        assertStringIncludes(res, "12.5 multiplicado por 0.15");
        assertStringIncludes(res, "é igual a 1 vírgula 88");
        assertStringIncludes(res, "(Arredondamento: HALF-UP para 2 casas decimais)");
    });

    it("toVerbalA11y: deve gerar descrição em en-US", async () => {
        const output = await Engine.from(12.5).mult(0.15).commit();
        const res = output.toVerbalA11y({ locale: "en-US" });
        
        assertStringIncludes(res, "12.5 multiplied by 0.15");
        assertStringIncludes(res, "is equal to 1 point 88");
        assertStringIncludes(res, "(Rounding: HALF-UP for 2 decimal places)");
    });

    it("toVerbalA11y: deve gerar descrição em es-ES", async () => {
        const output = await Engine.from(10).add(5).commit();
        const res = output.toVerbalA11y({ locale: "es-ES" });
        
        assertStringIncludes(res, "10 más 5");
        assertStringIncludes(res, "es igual a 15 coma 00");
    });

    it("toVerbalA11y: deve gerar descrição em fr-FR", async () => {
        const output = await Engine.from(20).div(2).commit();
        const res = output.toVerbalA11y({ locale: "fr-FR" });
        
        assertStringIncludes(res, "20 divisé par 2");
        assertStringIncludes(res, "est égal à 10 virgule 00");
    });

    it("toVerbalA11y: deve gerar descrição em ja-JP", async () => {
        const output = await Engine.from(100).sub(10).commit();
        const res = output.toVerbalA11y({ locale: "ja-JP" });
        
        assertStringIncludes(res, "100 ひく 10");
        assertStringIncludes(res, "は 90 点 00");
    });

    it("toVerbalA11y: deve respeitar precisão customizada", async () => {
        const output = await Engine.from(1.2345).commit();
        const res = output.toVerbalA11y({ decimalPrecision: 3, locale: "pt-BR" });
        
        assertStringIncludes(res, "1 vírgula 235"); // Arredondado HALF_UP
        assertStringIncludes(res, "para 3 casas decimais");
    });
});
