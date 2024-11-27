import { IListLoadResult } from './_interface/IListLoadResult';
import type { TDataConfigs, IDataConfig } from 'Controls-DataEnv/dataFactory';
import type { IFilterDescriptionItem } from 'Controls/filter';

export const LIST_CONTEXT_NODE_NAME = 'ListRoot';
export const FILTER_CONTEXT_NODE_NAME = 'FilterRoot';

function getFilterContextConfig(
    editorOptions: IFilterDescriptionItem['editorOptions']
): IDataConfig {
    return {
        dataFactoryName: 'Controls/dataFactory:List',
        dataFactoryArguments: editorOptions,
    };
}

export default function getContextConfig(loadResult: IListLoadResult) {
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
            name: LIST_CONTEXT_NODE_NAME,
            children: {
                FilterRoot: {
                    configs,
                    data: loadResults,
                },
            },
        };
    }
    return {};
}
