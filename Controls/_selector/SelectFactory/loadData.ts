import { IListDataFactoryLoadResult } from 'Controls-DataEnv/list';
import ISelectFactoryArguments from 'Controls/_selector/interfaces/ISelectFactoryArguments';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { TKey } from 'Controls/interface';
import { ISelectorTabConfig } from 'Controls/_selector/interfaces/ISelector';

export interface ISelectFactoryLoadResults {
    listsResults: Record<string, IListDataFactoryLoadResult>;
}

/**
 * Загружает данные для окна выбора
 * @public
 */
export default async function loadData(
    config: ISelectFactoryArguments
): Promise<ISelectFactoryLoadResults> {
    const { configs, initialKey } = config;
    //@ts-ignore
    const configKey = getConfigKey(configs, initialKey);
    //@ts-ignore
    const listsResults = await getListResults(configs, initialKey);
    return Promise.resolve({
        ...config,
        initialKey: configKey,
        listsResults,
    } as unknown as ISelectFactoryLoadResults);
}

function getConfigKey(configs: ISelectorTabConfig, initialKey?: TKey): TKey {
    return initialKey || Object.keys(configs)[0];
}

async function getListResults(
    configs: ISelectorTabConfig,
    initialKey?: TKey
): Promise<ISelectorTabConfig> {
    const configKey = getConfigKey(configs, initialKey);
    //@ts-ignore
    const { getConfig } = await loadAsync(configs[configKey]?.prefetchConfig);
    const factoryLoadResults = await Loader.load(getConfig());
    //@ts-ignore
    return factoryLoadResults;
}
