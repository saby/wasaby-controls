import ISelectFactoryArguments from 'Controls/_selector/interfaces/ISelectFactoryArguments';
import { ISelectFactoryLoadResults } from 'Controls/_selector/SelectFactory/loadData';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';

export const SELECT_CONTEXT_LISTS_NODE = Symbol('selectContextListNode');
export const LISTS_CONTEXT_NODE_NAME = 'ListRoot';

export interface ISelectorContextStructure {
    select: IDataConfig<ISelectFactoryArguments>;
    children: {
        [SELECT_CONTEXT_LISTS_NODE]: {
            [key: string]: IDataConfig;
        };
    };
}

export interface ISelectorContextConfig {
    configs: ISelectorContextStructure;
    loadResults: Record<string, unknown>;
}

/**
 * Возвращает структуру контекста окна выбора
 * @param loadResult
 * @param config
 * @public
 */
export default function getContextConfig(
    loadResult: ISelectFactoryLoadResults,
    config: ISelectFactoryArguments
): ISelectorContextConfig {
    return { loadResult, config } as unknown as ISelectorContextConfig;
}
