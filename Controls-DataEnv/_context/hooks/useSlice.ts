import SliceContext from '../contexts/SliceContext';
import * as React from 'react';
import { Slice } from '../../slice';
import HierarchySliceContext from '../contexts/HierarchySliceContext';
import { STORE_ROOT_NODE_KEY, CONTEXT_STORE_FIELD } from '../Constants';
import NodeContext from '../contexts/ISolatedNodeContext';

/**
 * Хук для получения слайса из контекста данных (см. подробнее в статье {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/ Управление данными для страниц и окон})
 * @param storeId уникальный идентификатор значения в контексте
 * @public
 */
export default function useSlice<T extends Slice>(storeId: string): T | undefined {
    const dataContext = React.useContext(SliceContext);
    const rootContext = React.useContext(HierarchySliceContext);
    const isolatedContextState = React.useContext(NodeContext);

    if (dataContext?.[storeId]) {
        return dataContext[storeId] as unknown as T;
    } else if (rootContext && isolatedContextState.path) {
        return rootContext[CONTEXT_STORE_FIELD].getElement(
            storeId,
            isolatedContextState.path
        ) as unknown as T;
    } else if (rootContext) {
        return rootContext[CONTEXT_STORE_FIELD].getElement(storeId, [
            STORE_ROOT_NODE_KEY,
        ]) as unknown as T;
    }
}
