import RootContext from './RootContext';
import * as React from 'react';
import { IDataConfigLoader } from 'Controls-DataEnv/dataFactory';
import { getWasabyContext } from 'UICore/Contexts';
import Store from '../Store';
import { Slice } from 'Controls-DataEnv/slice';

export interface IDataConfigs {
    configs: Record<string, IDataConfigLoader & { isAsyncConfigGetter: boolean }>;
    loadResults: Record<string, unknown>;
}

export interface IDataContextOptions {
    dataConfigs?: IDataConfigs;
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
    const storeChangedCallback = React.useCallback((value) => {
        setCounter((current: number) => {
            return current + 1;
        });
    }, []);
    const context = React.useContext(getWasabyContext());
    const store = React.useMemo(() => {
        return new Store({
            dataConfigs: props.dataConfigs,
            onChange: storeChangedCallback,
            router: context.Router,
        });
    }, [storeChangedCallback, context.Router, props.dataConfigs]);

    const [counter, setCounter] = React.useState(0);
    const rootContextValue = React.useMemo(() => {
        return {
            store: store.getValue(),
            getNode(root: string): Record<string, Slice> {
                return store.getState(root);
            },
        };
    }, [counter, store]);

    React.useEffect(() => {
        return () => store.destroy();
    }, [store]);

    return (
        <RootContext.Provider value={rootContextValue}>
            {React.cloneElement(props.children as JSX.Element, {
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
