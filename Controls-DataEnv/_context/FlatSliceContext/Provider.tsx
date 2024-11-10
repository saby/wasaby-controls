import SliceContext from './SliceContext';
import * as React from 'react';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { getWasabyContext } from 'UICore/Contexts';
import Store, { IFlatStoreProps } from '../Store';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import HierarchySliceContext from '../HierarchySliceContext/HierarchySliceContext';
import { ISOLATED_ROOT_NAME_FIELD } from '../Constants';

/**
 * @public
 */
export interface IDataContextOptions {
    /**
     * Результаты загрузки данных.
     * @remark Каждому результату должен соответствовать конфиг.
     * @see configs
     */
    loadResults?: Record<string, unknown>;
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
    configs?: Record<string, IDataConfig>;
    /**
     *
     */
    children: JSX.Element;
    /**
     *
     */
    changedCallback?: (store: unknown) => void;
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
     *
     * @param loadResults Результаты загрузки данных
     * @param context текущее состояние контекста, если состояние было создано ранее
     * @return Конфигурация фабрик, по которым будет создан контекст
     */
    getSlicesConfig?: (
        loadResults: object,
        context: object
    ) => Record<string, IDataConfig> | string;
    /**
     *
     */
    dataLayoutId?: string;
}

const DEFAULT_LOAD_RESULTS = {};
const DEFAULT_CONFIGS = {};

/**
 * Провайдер контекста с данными.
 * @public
 */
function Provider(
    props: IDataContextOptions & { forwardedRef: React.ForwardedRef<unknown> }
): React.ReactElement<IDataContextOptions> {
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
            loadResults: props.loadResults || DEFAULT_LOAD_RESULTS,
            configs: props.configs || DEFAULT_CONFIGS,
            onChange: storeChangedCallback,
            router: context.Router,
            getSlicesConfig,
        } as IFlatStoreProps;

        return new Store(storeProps);
    }, [props.loadResults, props.configs, storeChangedCallback, context.Router, getSlicesConfig]);

    React.useEffect(() => {
        return () => store.destroy();
    }, [store]);

    return (
        <SliceContext.Provider value={store.getState()}>
            {React.cloneElement(props.children, {
                forwardedRef: props.forwardedRef,
            })}
        </SliceContext.Provider>
    );
}

function DataLayoutProvider(props: {
    dataLayoutId: string;
    children: JSX.Element;
    forwardedRef: React.ForwardedRef<unknown>;
}): JSX.Element {
    const rootContext = React.useContext(HierarchySliceContext);
    const contextNodeValue = rootContext.getNode(props.dataLayoutId);
    const isolatedContextValue = React.useMemo(() => {
        return {
            ...contextNodeValue,
            [ISOLATED_ROOT_NAME_FIELD]: props.dataLayoutId,
        };
    }, [contextNodeValue]);

    return (
        <SliceContext.Provider value={isolatedContextValue}>{props.children}</SliceContext.Provider>
    );
}

/**
 * Провайдер контекста с данными.
 * @public
 */
export const DataContextProvider = React.forwardRef(function (
    props: IDataContextOptions,
    forwardedRef: React.ForwardedRef<unknown>
): React.ReactElement<object> {
    return props.dataLayoutId ? (
        <DataLayoutProvider
            dataLayoutId={props.dataLayoutId}
            children={props.children}
            forwardedRef={forwardedRef}
        />
    ) : (
        <Provider
            loadResults={props.loadResults}
            configs={props.configs}
            children={props.children}
            changedCallback={props.changedCallback}
            getSlicesConfig={props.getSlicesConfig}
            forwardedRef={forwardedRef}
        />
    );
});
