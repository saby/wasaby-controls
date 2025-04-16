import { IListDataFactoryLoadResult } from 'Controls-DataEnv/list';
import ISelectFactoryArguments from 'Controls/_selector/interfaces/ISelectFactoryArguments';
import { Loader, TDataConfigs } from 'Controls-DataEnv/dataLoader';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { CrudEntityKey } from 'Types/source';
import { ISelectorTabConfig, ISelectorTabsConfigs } from 'Controls/_selector/interfaces/ISelector';
import { getListConfigs, loadTabDeps, TSelectorDataConfigs } from './Utils';
import { loadHistoryItems, IHistoryLoadResult } from './History/loadHistoryItems';

/**
 * Данные, возвращаемые после загрузки данных окна выбора
 * @public
 */
export interface ISelectFactoryLoadResults {
    /**
     * Объект, содержащий результаты загрузки списочных слайсов в окне выбора для каждой вкладки
     */
    listResults: {
        [key: string]: Record<string, IListDataFactoryLoadResult>;
    };
    /**
     * Объект, содержащий настройки для загрузки списочных слайсов в окне выбора для каждой вкладки
     */
    listConfigs: {
        [key: string]: TSelectorDataConfigs;
    };
    /**
     * Идентификатор активной вкладки на окне выбора
     */
    selectedTabKey: CrudEntityKey;
    /**
     * Оюбъект, содержащий сохранненые и запиненные записи для каждой вкладки
     */
    historyItems?: {
        [key: string]: IHistoryLoadResult | null;
    };
}

/**
 * Загружает данные для окна выбора
 * @param config Аргументы фабрики окна выбора
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
 * @return CrudEntityKey
 */
function getInitialKey(configs: ISelectorTabsConfigs, initialKey?: CrudEntityKey): CrudEntityKey {
    return initialKey || Object.keys(configs)[0];
}

/**
 * Загружает данные для активной вкладки
 * @param tabConfig Конфигурация активной вкладки
 * @return Promise<Record<string, IListDataFactoryLoadResult>>
 */
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
