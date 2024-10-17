import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import HierarchySliceContextProvider from './HierarchyContextNodeProvider';
import * as React from 'react';
import DataLayoutProvider from './DataLayoutProvider';

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
    children: JSX.Element;
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
    dataLayoutId?: string;
}

/**
 * Провайдер контекста с данными.
 * @public
 */
export const DataContextProvider = React.forwardRef(function (
    props: IDataContextOptions,
    forwardedRef: React.ForwardedRef<unknown>
): React.ReactElement<object> {
    const contextConfig = React.useMemo(() => {
        return {
            contextConfigs: {
                configs: props.configs || {},
                data: props.loadResults || {},
            },
        };
    }, [props.configs, props.loadResults]);
    return props.dataLayoutId ? (
        <DataLayoutProvider dataLayoutId={props.dataLayoutId} ref={forwardedRef}>
            {props.children}
        </DataLayoutProvider>
    ) : (
        <HierarchySliceContextProvider
            dataConfigs={contextConfig}
            getSlicesConfig={props.getSlicesConfig}
        >
            <DataLayoutProvider ref={forwardedRef}>{props.children}</DataLayoutProvider>
        </HierarchySliceContextProvider>
    );
});
