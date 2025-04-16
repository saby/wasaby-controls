import type { TDataConfigs, IDataConfig, TContextConfig } from 'Controls-DataEnv/dataFactory';
import type { IFilterDescriptionItem } from 'Controls-DataEnv/interface';
import type { IListDataFactoryLoadResult } from './interface/factory/IListDataFactoryLoadResult';

/**
 * Имя корневого узла списка
 * */
export const LIST_CONTEXT_NODE_NAME = 'ListRoot';
/**
 * Имя корневого узла фильтра
 * */
export const FILTER_CONTEXT_NODE_NAME = 'FilterRoot';

/**
 * Получение конфигурации фильтра для фабрики данных
 * */
function getFilterContextConfig(
    editorOptions: IFilterDescriptionItem['editorOptions']
): IDataConfig {
    return {
        dataFactoryName: 'Controls/dataFactory:List',
        dataFactoryArguments: editorOptions,
    };
}

/**
 * Получение конфигурации фильтра для фабрики данных в рамках конфигурации списка
 * */
export default function getContextConfig(loadResult: IListDataFactoryLoadResult): TContextConfig {
    if (loadResult.filterDescription) {
        const configs: TDataConfigs = {};
        const loadResults: Record<string, unknown> = {};

        loadResult.filterDescription.forEach(({ name, type, editorOptions }) => {
            if (type === 'list') {
                configs[name] = getFilterContextConfig(editorOptions);
                loadResults[name] = editorOptions;
            }
        });

        return {
            configs: {},
            name: LIST_CONTEXT_NODE_NAME,
            children: {
                FilterRoot: {
                    configs,
                    data: loadResults,
                },
            },
        };
    }
}
