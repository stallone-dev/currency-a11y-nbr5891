/**
 * @title Método: CalcAUDOutput.toMonetary()
 * @description Exemplos de formatação monetária localizada usando `Intl.NumberFormat`.
 * @tags toMonetary, output, currency, i18n
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToMonetary() {
    console.log("--- CalcAUDOutput.toMonetary(): Formatação Monetária ---");

    const valorBase = CalcAUD.from("12345.67");

    // Exemplo 1: Padrão (pt-BR, BRL)
    const outputBR = valorBase.commit(2);
    console.log(`1. Padrão (pt-BR, BRL): ${outputBR.toMonetary()}`); // Saída: R$ 12.345,67

    // Exemplo 2: Dólar Americano (en-US, USD)
    const outputUS = valorBase.commit(2, { locale: "en-US", currency: "USD" });
    console.log(`2. Dólar Americano (en-US, USD): ${outputUS.toMonetary()}`); // Saída: $12,345.67

    // Exemplo 3: Euro (fr-FR, EUR)
    const outputFR = valorBase.commit(2, { locale: "fr-FR", currency: "EUR" });
    console.log(`3. Euro (fr-FR, EUR): ${outputFR.toMonetary()}`); // Saída: 12 345,67 €

    // Exemplo 4: Yen Japonês (ja-JP, JPY) - 0 casas decimais
    const valorYen = CalcAUD.from(50000.55);
    const outputJP = valorYen.commit(0, { locale: "ja-JP", currency: "JPY" });
    console.log(`4. Yen Japonês (ja-JP, JPY, 0 casas): ${outputJP.toMonetary()}`); // Saída: ￥50,001

    // Exemplo 5: Moeda personalizada com locale diferente
    // Formatar em português, mas exibir em Yuan Chinês
    const outputCustomCurrency = valorBase.commit(2, { locale: "pt-BR", currency: "CNY" });
    console.log(`5. Pt-BR com Yuan Chinês: ${outputCustomCurrency.toMonetary()}`); // Saída: CN¥ 12.345,67
}

exemploToMonetary();
