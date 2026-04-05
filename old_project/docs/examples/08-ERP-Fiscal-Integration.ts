/**
 * @title Exemplo 08: Integração em ERP Fiscal (Event Listener)
 * @description Demonstra o uso da CalcAUD em um contexto de ERP, processando itens fiscais via eventos
 *              e gerando saídas auditáveis para cada transação.
 * @tags erp, fiscal, integration, event-listener, advanced
 */

import { CalcAUD, CalcAUDOutput } from "../../src/main.ts";

// --- Modelos de Dados (Simulados) ---

/** Representa um item da Nota Fiscal */
interface FiscalItem {
    id: string;
    descricao: string;
    precoUnitario: string; // Usamos string para manter precisão na entrada
    quantidade: number;
    taxaICMS: string; // Ex: "0.18" para 18%
    taxaIPI: string; // Ex: "0.05" para 5%
    fiscalCode: "NORMAL" | "ISENTO" | "REDUZIDA"; // Código para lógica fiscal específica
}

/** Evento disparado quando um item fiscal é processado */
interface FiscalItemProcessedEvent {
    item: FiscalItem;
    calculoAuditado: CalcAUDOutput;
}

// --- Subsistema de Eventos (Simulado) ---

type EventListener<T> = (event: T) => void;

class ERPEventBus {
    private listeners: Map<string, EventListener<any>[]> = new Map();

    on<T>(eventType: string, listener: EventListener<T>) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)?.push(listener);
    }

    emit<T>(eventType: string, event: T) {
        this.listeners.get(eventType)?.forEach((listener) => listener(event));
    }
}

const erpBus = new ERPEventBus();

// --- Lógica de Processamento Fiscal ---

/**
 * Processa um item fiscal, calcula seus tributos e gera uma saída auditável.
 */
function processFiscalItem(item: FiscalItem): FiscalItemProcessedEvent {
    console.log(`
--- Processando Item Fiscal: ${item.descricao} (ID: ${item.id}) ---`);

    // 1. Calcular o Valor Bruto do Item
    const precoUnit = CalcAUD.from(item.precoUnitario);
    const quantidade = CalcAUD.from(item.quantidade);
    const valorBruto = precoUnit.mult(quantidade);

    // 2. Calcular ICMS
    const taxaICMS = CalcAUD.from(item.taxaICMS);
    const valorICMS = valorBruto.mult(taxaICMS);

    // 3. Calcular IPI (com lógica condicional)
    let valorIPI: CalcAUD;
    if (item.fiscalCode === "ISENTO") {
        valorIPI = CalcAUD.from(0);
        console.log("   IPI isento para este item.");
    } else if (item.fiscalCode === "REDUZIDA") {
        // Redução de 50% na base de cálculo do IPI
        const taxaIPI = CalcAUD.from(item.taxaIPI);
        valorIPI = valorBruto.mult(taxaIPI).mult("0.50");
        console.log("   IPI com base de cálculo reduzida em 50%.");
    } else {
        const taxaIPI = CalcAUD.from(item.taxaIPI);
        valorIPI = valorBruto.mult(taxaIPI);
    }

    // 4. Calcular Total Líquido (Valor Bruto + ICMS + IPI)
    const totalLiquido = valorBruto.add(valorICMS).add(valorIPI);

    // 5. Gerar Saída Auditável
    // Usamos NBR-5891 para arredondamento fiscal, 2 casas
    const calculoAuditado = totalLiquido.commit(2, {
        locale: "pt-BR",
        currency: "BRL",
        roundingMethod: "NBR-5891",
    });

    console.log(`   Valor Bruto: ${valorBruto.commit(2).toMonetary()}`);
    console.log(`   Valor ICMS: ${valorICMS.commit(2).toMonetary()}`);
    console.log(`   Valor IPI: ${valorIPI.commit(2).toMonetary()}`);
    console.log(`   Total Líquido: ${calculoAuditado.toMonetary()}`);
    console.log(`   Auditoria LaTeX: ${calculoAuditado.toLaTeX()}`);

    // Retorna o evento com o cálculo auditado
    return { item, calculoAuditado };
}

// --- Mock do ERP: Itens de uma Nota Fiscal ---
const notaFiscalItems: FiscalItem[] = [
    {
        id: "NF001-ITEM001",
        descricao: "Parafuso de Aço Inox",
        precoUnitario: "1.25",
        quantidade: 1000,
        taxaICMS: "0.18",
        taxaIPI: "0.05",
        fiscalCode: "NORMAL",
    },
    {
        id: "NF001-ITEM002",
        descricao: "Arruela de Borracha",
        precoUnitario: "0.15",
        quantidade: 5000,
        taxaICMS: "0.18",
        taxaIPI: "0.05",
        fiscalCode: "REDUZIDA",
    },
    {
        id: "NF001-ITEM003",
        descricao: "Mão de Obra (Serviço)",
        precoUnitario: "250.00",
        quantidade: 1,
        taxaICMS: "0.00", // Serviço pode ser isento de ICMS
        taxaIPI: "0.00", // Serviço é isento de IPI
        fiscalCode: "ISENTO",
    },
];

// --- Configuração do Event Listener no ERP ---

erpBus.on<FiscalItemProcessedEvent>("fiscalItemProcessed", (event) => {
    // Em um ERP real, este listener poderia:
    // - Gravar os dados no banco de dados fiscal
    // - Enviar para um sistema de compliance
    // - Atualizar o totalizador da Nota Fiscal
    console.log(`
[ERP Listener] Item '${event.item.descricao}' processado.`);
    console.log(`[ERP Listener] Total: ${event.calculoAuditado.toMonetary()}`);
    console.log(`[ERP Listener] Log de Auditoria: ${event.calculoAuditado.toUnicode()}`);
});

// --- Simulação do Fluxo do ERP ---

function simularProcessamentoERP() {
    console.log("--- Iniciando Simulação do ERP ---");
    let totalNotaFiscal = CalcAUD.from(0);

    for (const item of notaFiscalItems) {
        const event = processFiscalItem(item);
        erpBus.emit("fiscalItemProcessed", event);
        totalNotaFiscal = totalNotaFiscal.add(event.calculoAuditado.toCentsInBigInt()); // Acumula o valor arredondado
    }

    const totalAuditoria = totalNotaFiscal.commit(2, { locale: "pt-BR", currency: "BRL" });
    console.log(`
--- Simulação Concluída ---`);
    console.log(`TOTAL GERAL DA NOTA FISCAL: ${totalAuditoria.toMonetary()}`);
    console.log(`Auditoria LaTeX Total: ${totalAuditoria.toLaTeX()}`);
}

simularProcessamentoERP();
