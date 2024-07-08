import SliceContext from './FlatSliceContext/SliceContext';
import * as React from 'react';
import { Slice } from '../slice';
import HierarchySliceContext from './HierarchySliceContext/HierarchySliceContext';
import { ISOLATED_ROOT_NAME_FIELD, STORE_ROOT_NODE_KEY } from './Constants';
import { Logger } from 'UI/Utils';

/**
 * Хук для получения слайса из контекста данных (см. подробнее в статье {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/ Управление данными для страниц и окон})
 * @function Controls-DataEnv/_context/useSlice
 * @param storeId уникальный идентификатор значения в контексте
 */
export default function useSlice<T extends Slice>(storeId: string): T | undefined {
    const dataContext = React.useContext(SliceContext);
    const rootContext = React.useContext(HierarchySliceContext);

    if (!dataContext && !rootContext) {
        Logger.warn(
            'useSlice::DataContext undefined. Компонент находится вне DataContext и RootContext'
        );
        return;
    }

    const isolatedNodeName: string = dataContext?.[ISOLATED_ROOT_NAME_FIELD] as unknown as string;

    if (dataContext?.[storeId]) {
        return dataContext[storeId] as unknown as T;
    } else if (rootContext && isolatedNodeName) {
        return rootContext?.getElement(storeId, isolatedNodeName) as unknown as T;
    } else {
        return rootContext?.getElement(storeId, STORE_ROOT_NODE_KEY) as unknown as T;
    }
}
