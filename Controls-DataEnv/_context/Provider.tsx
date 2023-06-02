import DataContext from './DataContext';
import * as React from 'react';
import { TKey } from 'Controls/interface';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import StoreInitializer from './StoreInitializer';
import { getWasabyContext } from 'UICore/Contexts';
import { isEqual } from 'Types/object';
import { Slice } from 'Controls-DataEnv/slice';

export interface IDataContextOptions {
    loadResults: Record<TKey, unknown>;
    configs: Record<TKey, IDataConfig>;
    children: JSX.Element;
    changedCallback?: (store: unknown) => void;
}

function destroySlicesInStore(store: Record<string, Slice>): void {
    Object.values(store).forEach((storePropertyValue) => {
        if (
            storePropertyValue &&
            typeof storePropertyValue === 'object' &&
            storePropertyValue['[ISlice]']
        ) {
            (storePropertyValue as Slice).destroy();
        }
    });
}
/**
 * Провайдер контекста с данными.
 * @class Controls-DataEnv/_context/Provider
 * @public
 */

function Provider(
    props: IDataContextOptions
): React.ReactElement<IDataContextOptions> {
    const storeChangedCallback = (value) => {
        if (props.changedCallback) {
            props.changedCallback(value);
        }
        setStore(value);
    };
    const context = React.useContext(getWasabyContext());
    let storeValue;
    const firstRenderRef = React.useRef(true);
    const [loadResults, setLoadResults] = React.useState(props.loadResults);
    const [configs, setConfigs] = React.useState(props.configs);
    const loadResultsChanged = !isEqual(loadResults, props.loadResults);
    const configsChanged = !isEqual(configs, props.configs);
    if (firstRenderRef.current || loadResultsChanged || configsChanged) {
        storeValue = StoreInitializer(
            props.loadResults,
            props.configs,
            storeChangedCallback,
            context.Router
        );
    }
    const [store, setStore] = React.useState(storeValue);
    if (!firstRenderRef.current && (loadResultsChanged || configsChanged)) {
        destroySlicesInStore(store);
        setStore(storeValue);
        if (loadResultsChanged) {
            setLoadResults(props.loadResults);
        }
        if (configsChanged) {
            setConfigs(props.configs);
        }
    }

    React.useEffect(() => {
        firstRenderRef.current = false;
        return () => destroySlicesInStore(store);
    }, []);
    return (
        <DataContext.Provider value={store}>
            {props.children}
        </DataContext.Provider>
    );
}

export function DataContextProvider(
    props: IDataContextOptions
): React.ReactElement<object> {
    return (
        <Provider
            loadResults={props.loadResults}
            configs={props.configs}
            children={props.children}
            changedCallback={props.changedCallback}
        />
    );
}

/**
 * @name Controls-DataEnv/_context/Provider#configs
 * @cfg {Record<string, Controls-DataEnv/_dataFactory/interface/IDataConfig>} Конфигурации фабрик данных.
 * @example
 * <pre class="brush: js">
 *    const configs = {
 *        firstConfig: {
 *            dataFactoryName: '...',
 *            dataFactoryArguments: {}
 *        },
 *        secondConfig: {
 *            dataFactoryName: '...',
 *            dataFactoryArguments: {}
 *        }
 *    };
 * </pre>
 */

/**
 * @name Controls-DataEnv/_context/Provider#loadResults
 * @cfg {Record<string, unknown>} Результаты загрузки данных.
 * @remark Каждому результату должен соответствовать конфиг.
 * @see configs
 */
