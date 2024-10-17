import HierarchySliceContext, { IRootContext } from './HierarchySliceContext';
import SliceContext from '../FlatSliceContext/SliceContext';
import * as React from 'react';
import { IDataConfigLoader, IDataConfig } from 'Controls-DataEnv/dataFactory';
import { getWasabyContext } from 'UICore/Contexts';
import Store, { IFlatStoreProps } from '../Store';
import { Slice } from 'Controls-DataEnv/slice';
import type { IHierarchicalStoreProps } from '../Store';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { STORE_ROOT_NODE_KEY } from '../Constants';
import { applied } from 'Types/entity';
import ISolatedNodeContext from 'Controls-DataEnv/_context/ISolatedNodeContext';

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
     * @see configs
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
    getSlicesConfig?: (
        loadResults: object,
        context: object
    ) => Record<string, IDataConfig> | string;
    getSlicesContextNodeName?: string;
}

/**
 *
 * @private
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
    //@ts-ignore
    const context = React.useContext(getWasabyContext());
    const parentRootContext = React.useContext(HierarchySliceContext);
    const parentRootContextRef = React.useRef(parentRootContext);
    parentRootContextRef.current = parentRootContext;
    const parentSliceContext = React.useContext(SliceContext);
    const parentSliceContextRef = React.useRef(parentSliceContext);
    parentSliceContextRef.current = parentSliceContext;
    const nodeContext = React.useContext(ISolatedNodeContext);

    const contextKey = React.useMemo(() => {
        return applied.Guid.create();
    }, []);
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
            contextUUID: contextKey,
            storeValue: {},
            store,
            getNode(path: string[] | string): Record<string, Slice | unknown> | null {
                if (typeof path === 'string') {
                    if (nodeContext.path) {
                        const parentNode = store.getNodeByPath(nodeContext.path);
                        return parentNode?.getChild(path)?.getValue() || null;
                    }
                } else {
                    return store.getNodeValueByPath(path);
                }
                return null;
            },

            getElement(elementName: string, path: string[]): Slice | unknown {
                const localElement = store.getNodeByPath(path)?.getElement(elementName)?.getValue();
                if (localElement) {
                    return localElement;
                } else if (parentSliceContextRef.current?.[elementName]) {
                    return parentSliceContextRef.current?.[elementName];
                } else if (parentRootContextRef.current) {
                    return parentRootContextRef.current.getElement(elementName, [
                        STORE_ROOT_NODE_KEY,
                    ]);
                }
                /*
                 * Eсли элемент не нашли в текущем провайдере, то обращаемся к родительскому провайдеру.
                 * Будет удалено поcле перевода дизайн-тайма конструктора на единый контекст
                 */
                return parentRootContext?.getElement(elementName, [STORE_ROOT_NODE_KEY]);
            },
        };
    }, [counter, store, parentRootContext]);

    return (
        <HierarchySliceContext.Provider value={rootContextValue}>
            {React.cloneElement(props.children, {
                ref: forwardedRef,
            })}
        </HierarchySliceContext.Provider>
    );
}

export default React.forwardRef(Provider);
