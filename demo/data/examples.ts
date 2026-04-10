// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { mapAllOutputs } from "../logic/mapper.ts";
import { CalcAUY } from "@calc-auy";

type ExampleOutput = Record<string, string | number | null>;

export const getCategorizedExamples = () => {
    const globalRegistry: Record<string, Record<string, ExampleOutput>> = {};

    const register = (category: string, key: string, data: ExampleOutput) => {
        if (!globalRegistry[category]) { globalRegistry[category] = {}; }
        globalRegistry[category][key] = data;
        return data;
    };

    const examples = {
        outputs: {
            verbalMonetary: [
                {
                    title: "Locale PT-BR (Padrão)",
                    context: "Formatação padrão brasileira para valores monetários.",
                    code: "CalcAUY.from('1500.50').add(0.75).commit().toMonetary({ locale: 'pt-BR' })",
                    outputs: register(
                        "outputs",
                        "verbalMonetary_ptBR",
                        mapAllOutputs(
                            CalcAUY.from("1500.50").add(0.75).commit(),
                        ),
                    ),
                },
                {
                    title: "Locale EN-US (Internacional)",
                    context: "Formatação americana com ponto decimal e separador de milhares.",
                    code: "CalcAUY.from('1500.50').add(0.75).commit().toMonetary({ locale: 'en-US' })",
                    outputs: register(
                        "outputs",
                        "verbalMonetary_enUS",
                        mapAllOutputs(
                            CalcAUY.from("1500.50").add(0.75).commit(),
                        ),
                    ),
                },
                {
                    title: "Locale fr-FR (Europeu)",
                    context: "Formatação francesa (vírgula decimal, ponto milhar).",
                    code: "CalcAUY.from('1234567.89').commit().toMonetary({ locale: 'fr-FR' })",
                    outputs: register(
                        "outputs",
                        "verbalMonetary_deDE",
                        mapAllOutputs(
                            CalcAUY.from("1234567.89").commit(),
                        ),
                    ),
                },
                {
                    title: "Locale JA-JP (Iene)",
                    context: "Formatação japonesa.",
                    code: "CalcAUY.from('5000').mult(1.10).commit().toMonetary({ locale: 'ja-JP' })",
                    outputs: register(
                        "outputs",
                        "verbalMonetary_jaJP",
                        mapAllOutputs(
                            CalcAUY.from("5000").mult(1.10).commit(),
                        ),
                    ),
                },
            ],
            currencyOptions: [
                {
                    title: "BRL em Locale US",
                    context: "Exibindo Reais com formatação numérica americana.",
                    code: "CalcAUY.from(1000).commit().toMonetary({ locale: 'en-US', currency: 'BRL' })",
                    outputs: register(
                        "outputs",
                        "currency_brl_in_us",
                        mapAllOutputs(
                            CalcAUY.from(1000).commit(),
                        ),
                    ),
                },
                {
                    title: "EUR em Locale BR",
                    context: "Exibindo Euros com formatação numérica brasileira.",
                    code: "CalcAUY.from(50.55).commit().toMonetary({ locale: 'pt-BR', currency: 'EUR' })",
                    outputs: register(
                        "outputs",
                        "currency_eur_in_br",
                        mapAllOutputs(
                            CalcAUY.from(50.55).commit(),
                        ),
                    ),
                },
            ],
            roundingShowcase: [
                {
                    title: "NBR5891 (Bancário/Par)",
                    context: "2.5 -> 2 (Par mais próximo)",
                    code: "CalcAUY.from(2.5).commit({ roundStrategy: 'NBR5891' })",
                    outputs: register(
                        "outputs",
                        "rounding_nbr_even",
                        mapAllOutputs(
                            CalcAUY.from(2.5).commit({ roundStrategy: "NBR5891" }),
                        ),
                    ),
                },
                {
                    title: "HALF_UP (Comercial)",
                    context: "2.5 -> 3 (Sempre para cima no meio)",
                    code: "CalcAUY.from(2.5).commit({ roundStrategy: 'HALF_UP' })",
                    outputs: register(
                        "outputs",
                        "rounding_half_up",
                        mapAllOutputs(
                            CalcAUY.from(2.5).commit({ roundStrategy: "HALF_UP" }),
                        ),
                    ),
                },
                {
                    title: "TRUNCATE (Corte)",
                    context: "2.99 -> 2 (Descarta decimais)",
                    code: "CalcAUY.from(2.99).commit({ roundStrategy: 'TRUNCATE' })",
                    outputs: register(
                        "outputs",
                        "rounding_truncate",
                        mapAllOutputs(
                            CalcAUY.from(2.99).commit({ roundStrategy: "TRUNCATE" }),
                        ),
                    ),
                },
                {
                    title: "CEIL (Teto)",
                    context: "2.01 -> 3 (Próximo inteiro)",
                    code: "CalcAUY.from(2.01).commit({ roundStrategy: 'CEIL' })",
                    outputs: register(
                        "outputs",
                        "rounding_ceil",
                        mapAllOutputs(
                            CalcAUY.from(2.01).commit({ roundStrategy: "CEIL" }),
                        ),
                    ),
                },
            ],
            toString: [
                {
                    title: "Cadeia de Soma Complexa",
                    context: "Soma de múltiplos valores decimais flutuantes.",
                    code: "CalcAUY.from('0.1').add('0.2').add('0.3').sub('0.4').commit().toStringNumber()",
                    outputs: register(
                        "outputs",
                        "toString_chain",
                        mapAllOutputs(
                            CalcAUY.from("0.1").add("0.2").add("0.3").sub("0.4").commit(),
                        ),
                    ),
                },
            ],
            toMonetary: [
                {
                    title: "IOF Cascata (Juros sobre Juros)",
                    context: "Principal + Taxa fixa + (Taxa diária * Dias).",
                    code:
                        "CalcAUY.from(1000).mult(1.0038).add(CalcAUY.from(1000).mult(0.000082).mult(30)).commit().toMonetary()",
                    outputs: register(
                        "outputs",
                        "toMonetary_iof",
                        mapAllOutputs(
                            CalcAUY.from(1000).mult(1.0038).add(
                                CalcAUY.from(1000).mult(0.000082).mult(30),
                            ).commit(),
                        ),
                    ),
                },
            ],
        },
        operations: {
            add: [
                {
                    title: "Composição de Preço de Venda",
                    context: "Custo + Frete + Embalagem + Margem Fixa.",
                    code: "CalcAUY.from(50.00).add(12.50).add(2.30).add(20.00).commit()",
                    outputs: register(
                        "operations",
                        "add_price_composition",
                        mapAllOutputs(
                            CalcAUY.from(50.00).add(12.50).add(2.30).add(20.00).commit(),
                        ),
                    ),
                },
            ],
            mult: [
                {
                    title: "Juros Simples",
                    context: "Capital * Taxa * Tempo.",
                    code: "CalcAUY.from(1000).mult(0.05).mult(12).commit()",
                    outputs: register(
                        "operations",
                        "mult_simple_interest",
                        mapAllOutputs(
                            CalcAUY.from(1000).mult(0.05).mult(12).commit(),
                        ),
                    ),
                },
            ],
        },
    };

    return examples;
};
