import DataContext from './DataContext';
import * as React from 'react';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { getWasabyContext } from 'UICore/Contexts';
import Store, { IFlatStoreProps } from '../Store';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import RootContext from '../RootContext/RootContext';
import { ISOLATED_ROOT_NAME_FIELD } from '../Constants';

export interface IDataContextOptions {
    loadResults?: Record<string, unknown>;
    configs?: Record<string, IDataConfig>;
    children: JSX.Element;
    changedCallback?: (store: unknown) => void;
    getSlicesConfig?: string | Function;
    dataLayoutId?: string;
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
    const getSlicesConfig = React.useMemo<IFlatStoreProps['getSlicesConfig'] | undefined>(() => {
        if (typeof props.getSlicesConfig === 'string') {
            return loadSync<IFlatStoreProps['getSlicesConfig']>(props.getSlicesConfig);
        }
        return props.getSlicesConfig as IFlatStoreProps['getSlicesConfig'];
    }, [props.getSlicesConfig]);

    const [_, setCounter] = React.useState(0);
    const store = React.useMemo(() => {
        const storeProps: IFlatStoreProps = {
            loadResults: props.loadResults,
            configs: props.configs,
            onChange: storeChangedCallback,
            router: context.Router,
            getSlicesConfig,
        } as IFlatStoreProps;

        return new Store(storeProps);
    }, [props.loadResults, props.configs, storeChangedCallback, context.Router, getSlicesConfig]);

    React.useEffect(() => {
        return () => store.destroy();
    }, [store]);

    return <DataContext.Provider value={store.getState()}>{props.children}</DataContext.Provider>;
}

function DataLayoutProvider(props: { dataLayoutId: string; children: JSX.Element }): JSX.Element {
    const rootContext = React.useContext(RootContext);
    const contextNodeValue = rootContext.getNode(props.dataLayoutId);
    const isolatedContextValue = React.useMemo(() => {
        return {
            ...contextNodeValue,
            [ISOLATED_ROOT_NAME_FIELD]: props.dataLayoutId,
        };
    }, [contextNodeValue]);

    return (
        <DataContext.Provider value={isolatedContextValue}>{props.children}</DataContext.Provider>
    );
}

export function DataContextProvider(props: IDataContextOptions): React.ReactElement<object> {
    return props.dataLayoutId ? (
        <DataLayoutProvider dataLayoutId={props.dataLayoutId} children={props.children} />
    ) : (
        <Provider
            loadResults={props.loadResults}
            configs={props.configs}
            children={props.children}
            changedCallback={props.changedCallback}
            getSlicesConfig={props.getSlicesConfig}
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

/**
 * Метод получения конфигов слайсов при создании контекста. Нужно использовать в случае, если по одному результату загрузки нужно создать несколько слайсов
 * @name Controls-DataEnv/_context/Provider#getSlicesConfig
 * @example
 * <pre class="brush: js">
 * function getSlicesConfig(loadResults: unknown, currentState): IDataConfigs {
 *     if (!currentState) {
 *         return {
 *             sliceOrder1: {
 *                  dataFactoryName: 'Controls-DataEnvUnit/context/testDataFactories/FactoryWithProxyValues',
 *                  dataFactoryArguments: {},
 *             },
 *             sliceOrder2: {
 *                 dataFactoryName: 'Controls-DataEnvUnit/context/testDataFactories/FactoryWithProxyValues',
 *                 dataFactoryArguments: {},
 *             },
 *        };
 *     } else {
 *       currentState.sliceOrder1.setState({
 *           someValue: 2,
 *       });
 *      return {
 *          sliceOrder2: {
 *              dataFactoryName: 'Controls-DataEnvUnit/context/testDataFactories/FactoryWithProxyValues',
 *              dataFactoryArguments: {},
 *         },
 *     };
 *   }
 *}
 * </pre>
 * @function
 * @param {Object} loadResults Результаты загрузки данных
 * @param {Object} context - текущее состояние контекста, если состояние было создано ранее
 * @return {Record<string, Controls-DataEnv/_dataFactory/interface/IDataConfig>} конфигурация фабрик, по которым будет создан контекст
 */
