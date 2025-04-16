import { ReactElement, useContext, useMemo } from 'react';
import NodeContextPath, { IIsolatedContextState } from './contexts/ISolatedNodeContext';
import DataLayoutProvider from './providers/DataLayoutProvider';
import {
    IRootContext,
    default as HierarchyContext,
} from 'Controls-DataEnv/_context/contexts/HierarchySliceContext';

/**
 * Proxy-значения контекстов для использования в окне
 * @public
 */
export interface IDataContextProxyValues {
    /**
     * Значение контекста, который хранит стор
     */
    rootContext: IRootContext;
    /**
     * Значение контекста, который хранит путь до текущего уровня контекста данных
     */
    pathContext: IIsolatedContextState;
}

/**
 * Опции компонента, который оборачивает контент в нужные провайдеры для работы контекста данных
 * @public
 */
export interface IDataContextProxyProps {
    /**
     * Значения контекстов
     */
    proxyContextValues: IDataContextProxyValues;
    /**
     * Контент
     */
    children: ReactElement;
}

/**
 * Хук для получения значения текущего контекста данных.
 * Использовать в паре с компонентом.
 * @public
 */
export function useDataContextProxyValue(): IDataContextProxyProps['proxyContextValues'] {
    const rootContext = useContext(HierarchyContext);
    const pathContext = useContext(NodeContextPath);

    return useMemo(() => {
        return {
            rootContext,
            pathContext,
        };
    }, [rootContext, pathContext]);
}

/**
 * Временный компонент для проксирования контекста данных в окна
 * @public
 * @param props
 */
export default function DataContextProxyComponent(props: IDataContextProxyProps): ReactElement {
    if (!props.proxyContextValues) {
        return props.children;
    }
    return (
        <HierarchyContext.Provider value={props.proxyContextValues.rootContext}>
            <NodeContextPath.Provider value={props.proxyContextValues.pathContext}>
                <DataLayoutProvider>{props.children}</DataLayoutProvider>
            </NodeContextPath.Provider>
        </HierarchyContext.Provider>
    );
}
