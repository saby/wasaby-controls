import DataContext from './DataContext';
import * as React from 'react';
import { TKey } from 'Controls/interface';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { getWasabyContext } from 'UICore/Contexts';
import { isEqual } from 'Types/object';
import Store from './Store';

export interface IDataContextOptions {
    loadResults: Record<TKey, unknown>;
    configs: Record<TKey, IDataConfig>;
    children: JSX.Element;
    changedCallback?: (store: unknown) => void;
}
/**
 * Провайдер контекста с данными.
 * @class Controls-DataEnv/_context/Provider
 * @public
 */

function Provider(props: IDataContextOptions): React.ReactElement<IDataContextOptions> {
    const storeChangedCallback = (value) => {
        if (props.changedCallback) {
            props.changedCallback(value);
        }
        setStore(value);
    };
    const context = React.useContext(getWasabyContext());
    let storeValue;
    let storeInstance;
    const firstRenderRef = React.useRef(true);
    const [loadResults, setLoadResults] = React.useState(props.loadResults);
    const [configs, setConfigs] = React.useState(props.configs);
    const loadResultsChanged = !isEqual(loadResults, props.loadResults);
    const configsChanged = !isEqual(configs, props.configs);
    if (firstRenderRef.current || loadResultsChanged || configsChanged) {
        storeInstance = new Store({
            loadResults: props.loadResults,
            configs: props.configs,
            onChange: storeChangedCallback,
            router: context.Router,
        });

        storeValue = storeInstance.getState();
    }
    const [store, setStore] = React.useState(storeValue);
    const [storeState, setStoreState] = React.useState(storeInstance);
    if (!firstRenderRef.current && (loadResultsChanged || configsChanged)) {
        storeState.destroy();
        setStoreState(storeInstance);
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
        return () => storeState.destroy();
    }, []);
    return <DataContext.Provider value={store}>{props.children}</DataContext.Provider>;
}

export function DataContextProvider(props: IDataContextOptions): React.ReactElement<object> {
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
