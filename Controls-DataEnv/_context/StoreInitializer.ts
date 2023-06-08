import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TKey } from 'Controls/interface';
import { IDataConfig, IDataFactory, Custom } from 'Controls-DataEnv/dataFactory';
import { Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';

type IDataConfigs = Record<TKey, IDataConfig>;
type ILoadResults = {
    [key in keyof IDataConfigs]: unknown;
};

function isSimpleResult(config: IDataConfig): boolean {
    const customSliceNames = [
        'Controls/dataFactory:Custom',
        'Controls-DataEnv/dataFactory:Custom',
        'Controls-DataEnv/dataFactory:CompatibleCustom',
    ];
    return customSliceNames.includes(config.dataFactoryName);
}

const COMPATIBLE_TYPE_TO_INTERFACE = {
    list: '[IListSlice]',
};

function resolveDataFactoryArguments(
    dataFactory: IDataFactory,
    config: IDataConfig,
    loadResults: ILoadResults,
    Router: IRouter
): IDataConfig['dataFactoryArguments'] {
    if (!dataFactory.getDataFactoryArguments) {
        return config.dataFactoryArguments;
    }
    const dependenciesResults = {};
    if (config.dependencies) {
        config.dependencies.forEach((dependenciesName) => {
            dependenciesResults[dependenciesName] = loadResults[dependenciesName];
        });
    }
    return dataFactory.getDataFactoryArguments(
        config.dataFactoryArguments,
        dependenciesResults,
        Router
    );
}

export default function createStore(
    loadResults: ILoadResults,
    configs: IDataConfigs = {},
    storeChangedCallback: Function,
    Router: IRouter
): Record<string, Slice> {
    let state = {};
    const loadingQueues = {};
    const loadedFactories = {};
    const setState = (newState) => {
        storeChangedCallback(createStoreObject(newState));
    };
    Object.entries(loadResults).forEach(([key, loadResult]) => {
        const config = configs[key];
        if (config) {
            if (loadResult instanceof Promise) {
                const queue = config.dataFactoryCreationOrder || 0;
                if (!loadingQueues[queue]) {
                    loadingQueues[queue] = [];
                }
                loadingQueues[queue].push({
                    loadResult,
                    config,
                    key,
                });
            } else {
                loadedFactories[key] = loadResult;
            }
        }
    });
    Object.keys(loadingQueues).forEach((key) => {
        const queue = parseInt(key, 10);
        if (loadingQueues[queue]?.length) {
            const currentQueue = loadingQueues[queue];
            const loadingPromises = currentQueue.map((loadingQueue) => {
                return loadingQueue.loadResult;
            });
            Promise.all(loadingPromises).then((queueLoadResults) => {
                const loadResultsMap = {};
                queueLoadResults.forEach((loadResult, index) => {
                    const currentLoader = currentQueue[index];
                    loadResultsMap[currentLoader.key] = loadResult;
                });
                const newSlices = initSlices(loadResultsMap, configs, setState, Router);
                const newState = { ...state, ...newSlices };
                setState(newState);
            });
        }
    });
    state = initSlices(loadedFactories, configs, setState, Router);
    return createStoreObject(state);
}

function initSlices(
    loadResults: ILoadResults,
    configs: IDataConfigs = {},
    storeChangedCallback: Function,
    Router: IRouter
): Record<string, Slice> {
    const slices = {};
    Object.entries(loadResults).forEach(([key, loadResult]) => {
        if (!isSimpleResult(configs[key])) {
            const config = configs[key];
            const dataFactory = loadSync<IDataFactory>(config.dataFactoryName);
            const initializer = dataFactory.slice || Custom.slice;
            const dataFactoryArguments = resolveDataFactoryArguments(
                dataFactory,
                configs[key],
                loadResults,
                Router
            );
            const setState = () => {
                storeChangedCallback(slices);
            };
            if (initializer) {
                // Проверяем, что value - чистый объект, а не класс
                const isValueSimpleObject =
                    loadResult?.constructor === Object &&
                    Object.getPrototypeOf(loadResult) === Object.prototype;

                if (dataFactoryArguments?.name) {
                    // TODO: подумать куда положить функцию получения названия контекста и заиспользовать его здесь вместо индекса
                    const nameSliceKey = dataFactoryArguments.name[0];
                    dataFactoryArguments.formDataSlice = slices[nameSliceKey];
                }

                slices[key] = getInitializerState(
                    initializer,
                    setState,
                    isValueSimpleObject ? { ...loadResult } : loadResult,
                    dataFactoryArguments
                );
            }
        } else {
            slices[key] = loadResult;
        }
    });
    return slices;
}
// TODO: УБРАТЬ ИЗ КОНТРОЛОВ ЭТУ ФУНКЦИЮ.
function getStoreData(
    state: Record<TKey, Slice>,
    storeId: TKey | TKey[],
    firstOfType?: string
): Slice | Record<TKey, Slice> {
    if (storeId instanceof Array) {
        const result = {};
        Object.entries(state).forEach(([key, value]) => {
            if (storeId.includes(key)) {
                result[key] = value;
            }
        });
        return result;
    } else if (storeId !== null && storeId !== undefined) {
        return state[storeId];
    } else if (firstOfType) {
        return Object.values(state).find((value) => {
            return value?.[COMPATIBLE_TYPE_TO_INTERFACE[firstOfType]];
        });
    }
}

function createStoreObject(state: Record<string, Slice>): Record<string, Slice> {
    const descriptors = Object.getOwnPropertyDescriptors(state);
    return Object.create(
        {
            getStoreData: getStoreData.bind(null, state),
        },
        descriptors
    );
}

function getInitializerState(
    slice: IDataFactory['slice'],
    stateChangedCallback: Function,
    loadResult: unknown,
    config: IDataConfig['dataFactoryArguments']
): Slice {
    return new slice({
        config,
        loadResult,
        onChange: stateChangedCallback,
    });
}
