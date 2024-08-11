import HierarchySliceContext, { IRootContext } from './HierarchySliceContext';
import SliceContext from '../FlatSliceContext/SliceContext';
import * as React from 'react';
import { IDataConfigLoader, TDataConfigs } from 'Controls-DataEnv/dataFactory';
import { getWasabyContext } from 'UICore/Contexts';
import Store, { IFlatStoreProps } from '../Store';
import { Slice } from 'Controls-DataEnv/slice';
import type { IHierarchicalStoreProps } from '../Store';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { STORE_ROOT_NODE_KEY } from '../Constants';

/**
 * @public
 */
export interface IDataConfigs {
    /**
     * Конфигурации фабрик данных.
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
    configs: Record<string, IDataConfigLoader & { isAsyncConfigGetter: boolean }>;
    /**
     * Результаты загрузки данных.
     * @remark Каждому результату должен соответствовать конфиг.
     * @see {@link configs}
     */
    loadResults: Record<string, unknown>;
}

/**
 * @public
 */
export interface IDataContextOptions {
    dataConfigs: IHierarchicalStoreProps['dataConfigs'];
    children: JSX.Element;
    /**
     * Метод получения конфигов слайсов при создании контекста. Нужно использовать в случае, если по одному результату загрузки нужно создать несколько слайсов
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
     * @param loadResults Результаты загрузки данных
     * @param context - текущее состояние контекста, если состояние было создано ранее
     * @return Конфигурация фабрик, по которым будет создан контекст
     */
    getSlicesConfig?: (loadResults: object, context: object) => TDataConfigs | string;
    getSlicesContextNodeName?: string;
}

/**
 *
 */
export type TProviderRef = React.ForwardedRef<HTMLElement>;

/**
 * Провайдер контекста с данными.
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
    const parentRootContext = React.useContext(HierarchySliceContext);
    const parentRootContextRef = React.useRef(parentRootContext);
    const parentSliceContext = React.useContext(SliceContext);
    const parentSliceContextRef = React.useRef(parentSliceContext);
    const [counter, setCounter] = React.useState(0);
    const getSlicesConfig = React.useMemo<IFlatStoreProps['getSlicesConfig'] | undefined>(() => {
        if (typeof props.getSlicesConfig === 'string') {
            return loadSync<IFlatStoreProps['getSlicesConfig']>(props.getSlicesConfig);
        }
        return props.getSlicesConfig as IFlatStoreProps['getSlicesConfig'];
    }, [props.getSlicesConfig]);

    const store = React.useMemo(() => {
        const storeProps: IHierarchicalStoreProps = {
            dataConfigs: props.dataConfigs,
            onChange: storeChangedCallback,
            router: context.Router,
            getSlicesConfig,
            getSlicesContextNodeName: props.getSlicesContextNodeName,
        };
        return new Store(storeProps);
    }, [
        storeChangedCallback,
        context.Router,
        props.dataConfigs,
        getSlicesConfig,
        props.getSlicesContextNodeName,
    ]);

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
                const localElement = store.getElementValueFromNode(elementName, startNodeName);
                if (localElement) {
                    return localElement;
                } else if (parentSliceContextRef.current?.[elementName]) {
                    return parentSliceContextRef.current?.[elementName];
                } else if (parentRootContextRef.current) {
                    return parentRootContextRef.current.getElement(
                        elementName,
                        STORE_ROOT_NODE_KEY
                    );
                }
                /*
                 * Eсли элемент не нашли в текущем провайдере, то обращаемся к родительскому провайдеру.
                 * Будет удалено поcле перевода дизайн-тайма конструктора на единый контекст
                 */
                return parentRootContext?.getElement(elementName, STORE_ROOT_NODE_KEY);
            },
        };
    }, [counter, store, parentRootContext]);

    return (
        <HierarchySliceContext.Provider value={rootContextValue}>
            {React.cloneElement(props.children, {
                forwardedRef,
            })}
        </HierarchySliceContext.Provider>
    );
}

export default React.forwardRef(Provider);
