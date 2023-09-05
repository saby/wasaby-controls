import DataContext from './DataContext';
import * as React from 'react';
import { TKey } from 'Controls-DataEnv/interface';
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
    const storeChangedCallback = React.useCallback(
        (value) => {
            if (props.changedCallback) {
                props.changedCallback(value);
            }
            setCounter((current: number) => {
                return current + 1;
            });
        },
        [props.changedCallback]
    );
    const context = React.useContext(getWasabyContext());
    const store = React.useMemo(() => {
        return new Store({
            loadResults: props.loadResults,
            configs: props.configs,
            onChange: storeChangedCallback,
            router: context.Router,
        });
    }, [props.loadResults, props.configs, storeChangedCallback, context.Router]);
    const [counter, setCounter] = React.useState(0);
    React.useEffect(() => {
        return () => store.destroy();
    }, [store]);
    return <DataContext.Provider value={store.getState()}>{props.children}</DataContext.Provider>;
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
