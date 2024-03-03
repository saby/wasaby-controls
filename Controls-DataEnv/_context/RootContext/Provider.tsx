import RootContext, { IRootContext } from './RootContext';
import * as React from 'react';
import { IDataConfigLoader } from 'Controls-DataEnv/dataFactory';
import { getWasabyContext } from 'UICore/Contexts';
import Store from '../Store';
import { Slice } from 'Controls-DataEnv/slice';
import type { IHierarchicalStoreProps } from '../Store';

export interface IDataConfigs {
    configs: Record<string, IDataConfigLoader & { isAsyncConfigGetter: boolean }>;
    loadResults: Record<string, unknown>;
}

export interface IDataContextOptions {
    dataConfigs: IHierarchicalStoreProps['dataConfigs'];
    children: JSX.Element;
}

export type TProviderRef = React.ForwardedRef<HTMLElement>;

/**
 * Провайдер контекста с данными.
 * @class Controls-DataEnv/_context/Provider
 * @public
 */

function Provider(
    props: IDataContextOptions,
    forwardedRef: TProviderRef
): React.ReactElement<IDataContextOptions> {
    const storeChangedCallback = React.useCallback(() => {
        setCounter((current: number) => {
            return current + 1;
        });
    }, []);
    const context = React.useContext(getWasabyContext());
    const parentRootContext = React.useContext(RootContext);
    const [counter, setCounter] = React.useState(0);

    const store = React.useMemo(() => {
        const storeProps: IHierarchicalStoreProps = {
            dataConfigs: props.dataConfigs,
            onChange: storeChangedCallback,
            router: context.Router,
        };
        return new Store(storeProps);
    }, [storeChangedCallback, context.Router, props.dataConfigs]);

    React.useEffect(() => {
        return () => store.destroy();
    }, [store]);

    const rootContextValue: IRootContext = React.useMemo(() => {
        return {
            storeValue: store.getValue(),
            store,
            getNode(root: string): Record<string, Slice | unknown> {
                return store.getState(root);
            },

            getElement(elementName: string, startNodeName: string): Slice | unknown {
                return store.getElementValueFromNode(elementName, startNodeName);
            },
        };
    }, [counter, store, parentRootContext]);

    return (
        <RootContext.Provider value={rootContextValue}>
            {React.cloneElement(props.children, {
                forwardedRef,
            })}
        </RootContext.Provider>
    );
}

export default React.forwardRef(Provider);

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
