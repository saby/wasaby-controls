import NodeContext from '../contexts/ISolatedNodeContext';
import { CONTEXT_STORE_FIELD } from '../Constants';
import HierarchySliceContext from 'Controls-DataEnv/_context/contexts/HierarchySliceContext';
import { useContext, useRef, useMemo } from 'react';
import DataContextAPI from 'Controls-DataEnv/_context/dataContextAPI/DataContextAPI';

/**
 * Интерфейс "выполнителя" действия от текущего контекста данных
 */
export interface IContextActionExecutor {
    /**
     * Выполнить действие
     */
    execute: typeof DataContextAPI.prototype.execute;
}
/**
 * Хук для получения функции выполнения действия по текущему контексту данных
 * @see [Контекст данных](https://n.sbis.ru/article/08223bcf-5b6b-4573-9ff5-ae3a060cd6db)
 */
export default function useContextActionExecutor(): IContextActionExecutor {
    const rootContext = useContext(HierarchySliceContext);
    const nodeContext = useContext(NodeContext);
    const storeRef = useRef(rootContext?.[CONTEXT_STORE_FIELD]);
    storeRef.current = rootContext?.[CONTEXT_STORE_FIELD];

    return useMemo(() => {
        return {
            execute: async (methodName: string, methodArgs?: Record<string, unknown>) => {
                const currentContext = storeRef?.current?.getDataContext(nodeContext.path);

                return currentContext.execute(methodName, methodArgs);
            },
        };
    }, [nodeContext.path]);
}
