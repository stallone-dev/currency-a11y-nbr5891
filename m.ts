import { CalcAUY } from "~calc-auy";
import { msgpackHydrator, msgpackProcessor } from "./processor/msgpack/processor.msgpack.ts";
import { protobufHydrator, protobufProcessor } from "./processor/protobuffer/processor.protobuffer.ts";

/**
 * CENÁRIO: Ledger Corporativo Multi-Jurisdicional
 * Um rastro forense que une 6 departamentos diferentes.
 */

const SALT = "ULTRA-FORENSIC-LEDGER-2026";

try {
    // 1. COMERCIAL: Atendimento Inicial
    const Sales = CalcAUY.create({ contextLabel: "Comercial_SP", salt: SALT, sensitive: false });
    const contractFee = Sales.from("1500.00")
        .setMetadata("vendedor", "Jean_Luc_Picard")
        .setMetadata("tipo", "abertura_contrato");

    // 2. RH: Folha Parcial de Pagamento (Mão de obra dedicada)
    const HR = CalcAUY.create({ contextLabel: "RH_Operacional", salt: SALT, sensitive: true });
    const laborCost = HR.from("3200.50")
        .setMetadata("funcionario_id", "EMP-42")
        .setMetadata("horas_alocadas", 160)
        .add("450.00") // Benefícios
        .setMetadata("pii", true);

    // 3. LOGÍSTICA: Suprimentos
    const Logistic = CalcAUY.create({ contextLabel: "Warehouse_Miami", salt: SALT, sensitive: false });
    const materialCost = Logistic.from("12000.00")
        .setMetadata("id_sku", "SKU-999-X")
        .setMetadata("origem", "Global_Factory_Inc");

    // 4. TRIBUTÁRIO FEDERAL: Calculado Independente
    const TaxFed = CalcAUY.create({ contextLabel: "Fiscal_Federal", salt: SALT, sensitive: false });
    // O fiscal federal pega o custo de materiais da logística
    const materialRastro = await materialCost.hibernate();
    const federalTax = (await TaxFed.hydrate(materialRastro))
        .mult("0.15") // IPI 15%
        .setMetadata("lei", "Decreto Federal 7.212")
        .group();

    // 5. TRIBUTÁRIO ESTADUAL: Calculado Independente
    const TaxState = CalcAUY.create({ contextLabel: "Fiscal_Estadual_SP", salt: SALT, sensitive: false });
    const stateTax = (await TaxState.hydrate(materialRastro))
        .mult("0.18") // ICMS 18%
        .setMetadata("lei", "RICMS/SP")
        .group();

    // 6. CONTROLADORIA: Consolidação Total
    const Control = CalcAUY.create({ contextLabel: "Controladoria_Matriz", salt: SALT, sensitive: false });

    // Une todas as peças do quebra-cabeça
    const ledger = await Control.fromExternalInstance(contractFee); // Começa com o Comercial

    const finalConsolidation = ledger
        .add(await Control.fromExternalInstance(laborCost)) // Adiciona RH
        .add(await Control.fromExternalInstance(materialCost)) // Adiciona Materiais
        .add(await Control.fromExternalInstance(federalTax)) // Adiciona Imposto Federal
        .add(await Control.fromExternalInstance(stateTax)) // Adiciona Imposto Estadual
        .group()
        .mult("1.10") // Markup de Contingência
        .setMetadata("revisao_final", { status: "aprovado", auditor: "Stallone" });

    // EXECUÇÃO FINAL E GERAÇÃO DE RASTRO
    const output = await finalConsolidation.commit();

    console.log("--- ULTRA DIAGRAMA DE SEQUÊNCIA (LEDGER CORPORATIVO) ---");
    console.log(output.toUnicode());
    const msgpack = output.toCustomOutput(msgpackProcessor);
    console.log(msgpack);
    const protobuf = output.toCustomOutput(protobufProcessor);
    console.log(protobuf);

    const rehydratedMsgPack = msgpackHydrator(msgpack);
    console.log(rehydratedMsgPack);
    const rehydratedProtobuf = protobufHydrator(protobuf);
    console.log(rehydratedProtobuf);
} catch (e: any) {
    console.error("Falha na Consolidação do Ledger:", e);
}
