import ISelectFactoryArguments from 'Controls/_selector/interfaces/ISelectFactoryArguments';
import { ISelectFactoryLoadResults } from 'Controls/_selector/SelectFactory/loadData';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { loadSync } from 'WasabyLoader/ModulesLoader';

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
    if (loadResult.listsResults) {
        const configs = {};
        Object.keys(loadResult.listsResults).forEach((key) => {
            // @ts-ignore
            const prefetchConfig = loadResult.configs?.[key]?.prefetchConfig;
            // @ts-ignore
            configs[key] = loadSync(prefetchConfig)?.getConfig()[key];
        });
        return {
            // @ts-ignore
            name: SELECT_CONTEXT_LISTS_NODE,
            children: {
                [LISTS_CONTEXT_NODE_NAME]: {
                    configs,
                    data: loadResult.listsResults,
                },
            },
        };
    }
    return { loadResult, config } as unknown as ISelectorContextConfig;
}
