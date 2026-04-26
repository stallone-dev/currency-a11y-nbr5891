import type {
    CalcAUYCustomOutput,
    CalcAUYCustomOutputContext,
    CalculationNode,
} from "@st-all-one/calc-auy";

/**
 * Interface rigorosa para o registro no banco de dados (Prisma/SQL).
 */
export interface ICalcAUYPersistenceRecord {
    signature: string;
    context_label: string;
    round_strategy: string;
    result_numerator: string;
    result_denominator: string;
    ast: CalculationNode;
}

/**
 * Processador oficial para mapeamento de persistência denormalizada.
 */
export const persistenceProcessor: CalcAUYCustomOutput<
    ICalcAUYPersistenceRecord
> = function (ctx: CalcAUYCustomOutputContext): ICalcAUYPersistenceRecord {
    const trace = ctx.methods.toLiveTrace();

    if (!trace.finalResult) {
        throw new Error(
            "Persistence error: finalResult is required for storage.",
        );
    }

    return {
        signature: trace.signature,
        context_label: trace.contextLabel,
        round_strategy: trace.roundStrategy || "NONE",
        result_numerator: trace.finalResult.n,
        result_denominator: trace.finalResult.d,
        ast: trace.ast,
    };
};
