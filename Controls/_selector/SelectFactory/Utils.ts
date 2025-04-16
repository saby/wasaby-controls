import { ISelectorTabConfig, TSelectorTabsConfigs } from 'Controls/_selector/interfaces/ISelector';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { IListDataFactoryLoadResult } from 'Controls-DataEnv/list';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { CrudEntityKey } from 'Types/source';
import { ISelectFactoryLoadResults } from 'Controls/_selector/SelectFactory/loadData';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { TColumns } from 'Controls/grid';

interface ISelectorDataConfigs extends IDataConfig {
    multiSelectTemplate?: Function;
    multiSelectPosition?: 'default' | 'custom';
    columns?: TColumns;
    historyId?: string;
}

export type TSelectorDataConfigs = Record<string, ISelectorDataConfigs>;

/**
 * Загружает зависимости для вкладки
 */
export function loadTabDeps(
    tabConfig: ISelectorTabConfig,
    multiSelect?: boolean
): Promise<unknown> {
    const deps = [];
    const { contentConfig, topTemplateConfig, beforeTabsConfig, addButtonConfig, historyConfig } =
        tabConfig;

    if (contentConfig.workspaceConfig?.templateName) {
        deps.push(loadAsync(contentConfig.workspaceConfig.templateName));
    }

    if (contentConfig.toolbarConfig?.actions) {
        deps.push(loadAsync(contentConfig.toolbarConfig.actions));
    }

    if (topTemplateConfig?.templateName) {
        deps.push(loadAsync(topTemplateConfig.templateName));
    }

    if (beforeTabsConfig?.templateName) {
        deps.push(loadAsync(beforeTabsConfig.templateName));
    }

    if (addButtonConfig) {
        deps.push(loadAsync(addButtonConfig.menuConfigGetter));
        deps.push(loadAsync(addButtonConfig.activateHandler));
    }

    if (historyConfig?.historyId) {
        deps.push(
            loadAsync(
                historyConfig?.viewMode === 'tile'
                    ? 'Controls/columns:ItemsView'
                    : 'Controls/list:ItemsView'
            )
        );
        deps.push(
            loadAsync(
                historyConfig?.viewMode === 'tile'
                    ? 'Controls/columns:ItemTemplate'
                    : 'Controls/list:ItemTemplate'
            )
        );
    }

    if (historyConfig?.itemTemplate) {
        deps.push(loadAsync(historyConfig?.itemTemplate));
    }

    if (multiSelect) {
        deps.push(loadAsync('Controls/selectorSticky:MultiSelectPlusTemplate'));
    }

    return Promise.all(deps);
}

export async function getListConfigs(
    configs: TSelectorTabsConfigs,
    listName: CrudEntityKey,
    multiSelect?: boolean
): Promise<TSelectorDataConfigs> {
    const { getConfig } = await loadAsync<{
        getConfig: (args?: unknown) => ISelectFactoryLoadResults['listConfigs'];
    }>(configs[listName]?.prefetchConfig.configLoader);
    const listConfig = getConfig(configs[listName]?.prefetchConfig.configLoaderArguments);
    const { storeId } = configs[listName];
    if (Object.keys(configs).length > 1 && multiSelect) {
        listConfig[storeId].dataFactoryArguments = {
            ...listConfig[storeId].dataFactoryArguments,
            columns: await getColumns(listConfig[storeId].dataFactoryArguments.columns),
        };
    }
    return listConfig as unknown as TSelectorDataConfigs;
}

export async function getListResults(
    listsConfigs: TSelectorDataConfigs
): Promise<Record<string, IListDataFactoryLoadResult>> {
    return Loader.load(listsConfigs) as unknown as Record<string, IListDataFactoryLoadResult>;
}

async function getColumns(columns?: TColumns): Promise<TColumns | undefined> {
    if (columns) {
        return [
            ...columns,
            {
                width: 'min-content',
                template: await loadAsync('Controls-Layout/selectorStack:MultiSelectColumn'),
            },
        ];
    }
    return undefined;
}
