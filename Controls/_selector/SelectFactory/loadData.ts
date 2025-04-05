import { IListDataFactoryLoadResult } from 'Controls-DataEnv/list';
import ISelectFactoryArguments from 'Controls/_selector/interfaces/ISelectFactoryArguments';
import { Loader, TDataConfigs } from 'Controls-DataEnv/dataLoader';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { CrudEntityKey } from 'Types/source';
import { ISelectorTabConfig, TSelectorTabsConfigs } from 'Controls/_selector/interfaces/ISelector';
import { getListConfigs, loadTabDeps, TSelectorDataConfigs } from './Utils';
import { loadHistoryItems, IHistoryLoadResult } from './History/loadHistoryItems';

export interface ISelectFactoryLoadResults {
    listResults: {
        [key: string]: Record<string, IListDataFactoryLoadResult>;
    };
    listConfigs: {
        [key: string]: TSelectorDataConfigs;
    };
    selectedTabKey: CrudEntityKey;
    historyItems?: {
        [key: string]: IHistoryLoadResult | null;
    };
}

/**
 * Загружает данные для окна выбора
 * @public
 */
export default async function loadData(
    config: ISelectFactoryArguments
): Promise<ISelectFactoryLoadResults> {
    const { configs, initialKey, multiSelect } = config;
    const configKey = getInitialKey(configs, initialKey);
    const tabConfig = configs[configKey];
    const tabDepsPromise = loadTabDeps(tabConfig, multiSelect);
    const listConfigs = await getListConfigs(configs, configKey, multiSelect);
    const listResults = await loadInitialTabData(tabConfig);
    return Promise.all([loadHistoryItems(tabConfig, listResults, configKey), tabDepsPromise]).then(
        ([historyItems]) => {
            return {
                selectedTabKey: configKey,
                historyItems: {
                    [configKey]: historyItems,
                },
                listResults: {
                    [configKey]: listResults,
                },
                listConfigs: {
                    [configKey]: listConfigs,
                },
            };
        }
    );
}

/**
 * Возвращает идентификатор активной вкладки на окне выбора
 * @param configs
 * @param initialKey
 */
function getInitialKey(configs: TSelectorTabsConfigs, initialKey?: CrudEntityKey): CrudEntityKey {
    return initialKey || Object.keys(configs)[0];
}

async function loadInitialTabData(
    tabConfig: ISelectorTabConfig
): Promise<Record<string, IListDataFactoryLoadResult>> {
    const { getConfig } = await loadAsync<{ getConfig: (args: unknown) => TDataConfigs }>(
        tabConfig.prefetchConfig.configLoader
    );
    return Loader.load(
        getConfig(tabConfig.prefetchConfig.configLoaderArguments)
    ) as unknown as Record<string, IListDataFactoryLoadResult>;
}
