import { default as HierarchyContext, IRootContext } from '../contexts/HierarchySliceContext';
import * as React from 'react';
import { IDataConfigLoader, IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IFlatStoreProps } from '../store/Store';
import type { IHierarchicalStoreProps } from '../store/Store';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { CONTEXT_STORE_FIELD, STORE_ROOT_NODE_KEY } from 'Controls-DataEnv/_context/Constants';
import useStore from 'Controls-DataEnv/_context/hooks/private/useStore';
import ISolatedNodeContext from 'Controls-DataEnv/_context/contexts/ISolatedNodeContext';
import { relation } from 'Types/entity';

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
export type TProviderRef = React.ForwardedRef<unknown>;

/**
 * Провайдер контекста с данными.
 * @public
 */
function HierarchySliceContextProvider(
    props: IDataContextOptions,
    _: TProviderRef
): React.ReactElement<IDataContextOptions> {
    const storeChangedCallback = React.useCallback(() => {
        setCounter((current: number) => {
            return current + 1;
        });
    }, []);

    const nodeContext = React.useContext(ISolatedNodeContext);

    const [counter, setCounter] = React.useState(0);
    const getSlicesConfig = React.useMemo<IFlatStoreProps['getSlicesConfig'] | undefined>(() => {
        if (typeof props.getSlicesConfig === 'string') {
            return loadSync<IFlatStoreProps['getSlicesConfig']>(props.getSlicesConfig);
        }
        return props.getSlicesConfig as IFlatStoreProps['getSlicesConfig'];
    }, [props.getSlicesConfig]);

    const dataConfigs = React.useMemo(() => {
        let contextConfigs = {};
        if (props.dataConfigs.configs && props.dataConfigs.loadResults) {
            const tree = new relation.Tree<any>({
                parentProperty: 'parentId',
                childrenProperty: 'children',
                keyProperty: 'name',
            });
            const configs = { ...props.dataConfigs.configs };
            const loadResults = { ...props.dataConfigs.loadResults };
            Object.entries(props.dataConfigs.configs).forEach(([name, value]) => {
                const config = { ...value };
                if (!config.parentId && name !== 'root') {
                    config.parentId = 'root';
                }
                config.data = loadResults?.[name] || {};
                configs[name] = config;
            });
            if (!configs[STORE_ROOT_NODE_KEY]) {
                // @ts-ignore
                configs[STORE_ROOT_NODE_KEY] = {};
            }
            let contextObj;
            if (Object.keys(configs).length === 1) {
                contextObj = configs;
            } else {
                tree.parseTree(configs);
                contextObj = tree.toObject();
            }

            contextConfigs = contextObj[STORE_ROOT_NODE_KEY] || {};
        } else {
            // @ts-ignore;
            contextConfigs = { ...(props.dataConfigs.contextConfigs || props.dataConfigs) };
        }
        return contextConfigs;
    }, [props.dataConfigs]);

    const { store, rootKey } = useStore(
        //@ts-ignore
        dataConfigs,
        storeChangedCallback,
        getSlicesConfig,
        props.getSlicesContextNodeName
    );

    const path = React.useMemo(() => {
        if (nodeContext?.path?.length) {
            return [...nodeContext.path, rootKey];
        } else {
            return [rootKey];
        }
    }, [nodeContext]);

    const isolatedContextValue = React.useMemo(() => {
        return {
            dataLayoutId: rootKey,
            path,
        };
    }, [path]);

    const rootContextValue: IRootContext = React.useMemo(() => {
        return {
            [CONTEXT_STORE_FIELD]: store,
            rootKey,
        };
    }, [counter, store]);

    return (
        <ISolatedNodeContext.Provider value={isolatedContextValue}>
            <HierarchyContext.Provider value={rootContextValue} children={props.children} />
        </ISolatedNodeContext.Provider>
    );
}

export default React.forwardRef(HierarchySliceContextProvider);
