import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { CalcAUY } from "@src/main.ts";

describe("Output: Slicing (Distribution)", () => {
    const Engine = CalcAUY.create({
        contextLabel: "slicing-test",
        salt: "salt",
        roundStrategy: "HALF_UP"
    });

    it("toSlice: deve dividir o valor em partes iguais distribuindo o resto (10/3)", async () => {
        const output = await Engine.from(10).commit();
        const shares = output.toSlice(3);
        
        assertEquals(shares, ["3.34", "3.33", "3.33"]);
        
        // Validação da soma: 3.34 + 3.33 + 3.33 = 10.00
        const sum = shares.reduce((acc, val) => acc + Number.parseFloat(val), 0);
        assertEquals(sum, 10);
    });

    it("toSliceByRatio: deve dividir proporcionalmente (1000 com ratios)", async () => {
        const output = await Engine.from(1000).commit();
        const ratios = ["5%", "70%", "3.64%", "21.36%"];
        const split = output.toSliceByRatio(ratios);
        
        // [50, 700, 36.4, 213.6] -> total 1000
        // Ajustado pelo Largest Remainder se necessário
        assertEquals(split.length, 4);
        
        const sum = split.reduce((acc, val) => acc + Number.parseFloat(val) * 100, 0);
        assertEquals(sum, 100000); // 1000.00 em centavos
    });

    it("toSliceByRatio: deve suportar ratios como números", async () => {
        const output = await Engine.from(100).commit();
        const split = output.toSliceByRatio([0.5, 0.5]);
        assertEquals(split, ["50.00", "50.00"]);
    });

    it("toSlice: deve respeitar a precisão customizada", async () => {
        const output = await Engine.from(1).commit();
        const shares = output.toSlice(3, { decimalPrecision: 3 });
        assertEquals(shares, ["0.334", "0.333", "0.333"]);
    });
});
